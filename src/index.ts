import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { articulos } from "./routes/articulosRoute";

const app = express();
app.use(express.json());
app.use("/articulos", articulos);

app.use(errorHandler);
app.get("/",(req,res)=>{
    res.send("OK")
})

app.listen(env.APP_PORT, () => {
  console.log(`Servidor en puerto ${env.APP_PORT}`);
});
