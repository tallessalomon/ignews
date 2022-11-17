import { Client } from "faunadb";

// as operações feitas no banco de dados, ou stripe ou qualquer coisa que precise de acesso a chaves secretas, elas não podem ser feitas pelo lado do broser
// ou seja, nao pode fazer operação de consulta ao banco direto dentro de componentes/useeffect e sim dentro das api-routes ou nos metodos getStaticProps/getServersideProps que tbm só rodam no backend da aplicação e nao no client
export const fauna = new Client({
  secret: process.env.FAUNADB_KEY || "fnAE1naU_AACT0VxDoR-u4A5GyPhbt2oM0Nw4XyN"
})