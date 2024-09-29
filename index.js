import app from "./app.js";


const PORT = 3001;

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
        process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
});