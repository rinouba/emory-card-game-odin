export default function convertToBase64(filePath) {
  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(blob)

        fileReader.onload = () => {
          resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
          reject(error)
        }
      })
      .catch((error) => reject(error))
  })
}
