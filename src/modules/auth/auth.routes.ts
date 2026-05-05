import {GroupingProvider} from "gatex-express";
import {CreateAuthSchema} from "@modules/auth/auth.type";
import {register} from "@modules/auth/auth.controllers";

export default function (GP: GroupingProvider) {
    GP.post('/register', {body: CreateAuthSchema}, register)
}
