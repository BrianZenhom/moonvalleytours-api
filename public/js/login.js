/*eslint-disable*/ 

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:1234/api/v1/auth/login',
      data: {
        email,
        password
      }
    })

    if (res.data.status === 'success') {
      alert('Logged in successfully!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    alert(err.response.data.message)
  }
}


