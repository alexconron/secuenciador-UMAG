import { createClient } from "graphql-ws";

const graphqlClient = createClient({
  url: "ws://localhost:8000/",
});

export default graphqlClient;