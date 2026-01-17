/**
 * Extract ID3v1 and ID3v2 metadata (title, artist) from an MP3 file
 * @param {File} file - The audio file to parse
 * @returns {Promise<{title?: string, artist?: string}>} - Extracted metadata
 */
export function extractAudioMetadata(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const buffer = e.target.result
        const view = new DataView(buffer)

        // Try ID3v2 first (at the start of the file)
        const id3v2 = parseID3v2(view)
        if (id3v2.title || id3v2.artist) {
          resolve(id3v2)
          return
        }

        // Fallback to ID3v1 (at the end of the file)
        const id3v1 = parseID3v1(view)
        resolve(id3v1)
      } catch {
        resolve({})
      }
    }

    reader.onerror = () => resolve({})
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse ID3v2 tags from the beginning of the file
 */
function parseID3v2(view) {
  const result = { title: undefined, artist: undefined }

  // Check for "ID3" header
  if (view.byteLength < 10) return result
  if (
    view.getUint8(0) !== 0x49 || // 'I'
    view.getUint8(1) !== 0x44 || // 'D'
    view.getUint8(2) !== 0x33    // '3'
  ) {
    return result
  }

  const majorVersion = view.getUint8(3)
  // const minorVersion = view.getUint8(4)
  // const flags = view.getUint8(5)

  // Calculate tag size (syncsafe integer)
  const size = (
    (view.getUint8(6) & 0x7f) << 21 |
    (view.getUint8(7) & 0x7f) << 14 |
    (view.getUint8(8) & 0x7f) << 7 |
    (view.getUint8(9) & 0x7f)
  )

  const tagEnd = Math.min(10 + size, view.byteLength)
  let offset = 10

  // ID3v2.2 uses 3-character frame IDs, v2.3+ uses 4-character
  const frameIdLength = majorVersion === 2 ? 3 : 4
  const frameSizeLength = majorVersion === 2 ? 3 : 4
  const frameHeaderLength = majorVersion === 2 ? 6 : 10

  while (offset + frameHeaderLength < tagEnd) {
    // Read frame ID
    let frameId = ''
    for (let i = 0; i < frameIdLength; i++) {
      const char = view.getUint8(offset + i)
      if (char === 0) break
      frameId += String.fromCharCode(char)
    }

    if (!frameId || frameId[0] === '\0') break

    // Read frame size
    let frameSize
    if (majorVersion === 2) {
      frameSize = (
        view.getUint8(offset + 3) << 16 |
        view.getUint8(offset + 4) << 8 |
        view.getUint8(offset + 5)
      )
    } else if (majorVersion === 3) {
      frameSize = view.getUint32(offset + 4)
    } else {
      // ID3v2.4 uses syncsafe integers for frame size
      frameSize = (
        (view.getUint8(offset + 4) & 0x7f) << 21 |
        (view.getUint8(offset + 5) & 0x7f) << 14 |
        (view.getUint8(offset + 6) & 0x7f) << 7 |
        (view.getUint8(offset + 7) & 0x7f)
      )
    }

    if (frameSize <= 0 || offset + frameHeaderLength + frameSize > tagEnd) break

    const frameDataStart = offset + frameHeaderLength
    const frameDataEnd = frameDataStart + frameSize

    // Parse title and artist frames
    // TT2 = ID3v2.2 title, TIT2 = ID3v2.3/4 title
    // TP1 = ID3v2.2 artist, TPE1 = ID3v2.3/4 artist
    if (frameId === 'TIT2' || frameId === 'TT2') {
      result.title = readTextFrame(view, frameDataStart, frameDataEnd)
    } else if (frameId === 'TPE1' || frameId === 'TP1') {
      result.artist = readTextFrame(view, frameDataStart, frameDataEnd)
    }

    // Early exit if we found both
    if (result.title && result.artist) break

    offset = frameDataEnd
  }

  return result
}

/**
 * Read a text frame from ID3v2
 */
function readTextFrame(view, start, end) {
  if (start >= end) return undefined

  const encoding = view.getUint8(start)
  const textStart = start + 1
  const textEnd = end

  if (textStart >= textEnd) return undefined

  let text = ''

  if (encoding === 0 || encoding === 3) {
    // ISO-8859-1 or UTF-8
    const bytes = []
    for (let i = textStart; i < textEnd; i++) {
      const byte = view.getUint8(i)
      if (byte === 0) break
      bytes.push(byte)
    }
    text = new TextDecoder(encoding === 3 ? 'utf-8' : 'iso-8859-1').decode(new Uint8Array(bytes))
  } else if (encoding === 1 || encoding === 2) {
    // UTF-16 with or without BOM
    const bytes = []
    for (let i = textStart; i < textEnd - 1; i += 2) {
      const word = view.getUint16(i, encoding === 2) // LE for UTF-16LE
      if (word === 0) break
      bytes.push(word)
    }
    text = String.fromCharCode(...bytes)
    // Remove BOM if present
    if (text.charCodeAt(0) === 0xFEFF || text.charCodeAt(0) === 0xFFFE) {
      text = text.slice(1)
    }
  }

  return text.trim() || undefined
}

/**
 * Parse ID3v1 tags from the last 128 bytes of the file
 */
function parseID3v1(view) {
  const result = { title: undefined, artist: undefined }

  if (view.byteLength < 128) return result

  const tagStart = view.byteLength - 128

  // Check for "TAG" identifier
  if (
    view.getUint8(tagStart) !== 0x54 ||     // 'T'
    view.getUint8(tagStart + 1) !== 0x41 || // 'A'
    view.getUint8(tagStart + 2) !== 0x47    // 'G'
  ) {
    return result
  }

  // Title: bytes 3-32 (30 bytes)
  const titleBytes = []
  for (let i = 0; i < 30; i++) {
    const byte = view.getUint8(tagStart + 3 + i)
    if (byte === 0) break
    titleBytes.push(byte)
  }
  if (titleBytes.length > 0) {
    result.title = new TextDecoder('iso-8859-1').decode(new Uint8Array(titleBytes)).trim() || undefined
  }

  // Artist: bytes 33-62 (30 bytes)
  const artistBytes = []
  for (let i = 0; i < 30; i++) {
    const byte = view.getUint8(tagStart + 33 + i)
    if (byte === 0) break
    artistBytes.push(byte)
  }
  if (artistBytes.length > 0) {
    result.artist = new TextDecoder('iso-8859-1').decode(new Uint8Array(artistBytes)).trim() || undefined
  }

  return result
}
