import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();
const clientId = process.env.CLIENT_ID;
console.log(clientId);

const client = new OAuth2Client({ clientId });

async function verifyIdToken(idToken) {
    const loginTicket = await client.verifyIdToken({
        idToken,
        audience: clientId,
    });

    const userData = loginTicket.getPayload();
    return userData;
}
export { verifyIdToken };
