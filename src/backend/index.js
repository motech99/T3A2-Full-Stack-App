import app from './app.js'

// Start the server
app.listen(process.env.PORT || 4001, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Server running')
    }
})