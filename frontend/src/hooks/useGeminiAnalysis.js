import axios from 'axios'

export async function analyzeFood(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)

  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 15000,
  })

  return res.data
}
