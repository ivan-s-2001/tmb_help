export function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function buildTrackPoints(min, max, step) {
  const points = []

  for (let value = min; value <= max; value += step) {
    points.push(value)
  }

  if (!points.length || points[points.length - 1] !== max) {
    points.push(max)
  }

  return points
}

export function getBlockParagraphs(block) {
  if (Array.isArray(block.paragraphs) && block.paragraphs.length) {
    return block.paragraphs
  }

  if (typeof block.text === 'string' && block.text.trim()) {
    return [block.text]
  }

  return []
}

export function buildFaceEntries(block, die) {
  if (!die?.faces?.length) {
    return []
  }

  const requestedFaceIndices = Array.isArray(block.faceIndices) && block.faceIndices.length
    ? block.faceIndices
    : die.faces.map((_, index) => index)

  return requestedFaceIndices
    .map((faceIndex) => ({
      faceIndex,
      face: die.faces[faceIndex],
    }))
    .filter(({ face }) => Boolean(face))
}

export function getFaceDetail(block, faceIndex, fallbackFace) {
  const faceDetails = Array.isArray(block.faceDetails) ? block.faceDetails : []
  const indexedDetail = faceDetails.find((detail) => detail?.index === faceIndex)
  const arrayDetail = indexedDetail ?? faceDetails[faceIndex] ?? null

  return {
    title: arrayDetail?.title ?? fallbackFace?.name ?? `Грань ${faceIndex + 1}`,
    description: arrayDetail?.description ?? fallbackFace?.meaning ?? '',
    note: arrayDetail?.note ?? '',
  }
}
