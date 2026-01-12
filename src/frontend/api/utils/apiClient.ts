import createClient from "openapi-fetch";
import type { paths } from "@/contracts/api";

export const apiClient = createClient<paths>();