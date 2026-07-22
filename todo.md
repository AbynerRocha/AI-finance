Separar o wallet do transaction nas rotas e nos metodos
Retornar no GET /wallet/:id e no GET /wallet 
    - os dados da wallet sem as transações
    - Retornar apenas a ultima transação
  
Criar um GET /wallet/:id/transactions?page=[]
    - Paginado

Criar um GET /wallet/:id/transaction:id
    - Paginado