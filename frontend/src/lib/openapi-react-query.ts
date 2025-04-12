import { fetchClient } from "@/lib/fetch-client";
import createClient from "openapi-react-query";

export const api = createClient(fetchClient);
