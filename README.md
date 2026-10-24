# MetaindÃºstria â€” Mobile Dev | Sprint 4 (Entrega Final)

Aplicativo de monitoramento e cadastro de equipamentos industriais, desenvolvido para a disciplina **Advanced Programming & Mobile Dev**. A soluÃ§Ã£o integra um **backend REST com Java/Spring Boot** e um **aplicativo mobile com React Native, Expo e TypeScript**.

## 1. Problema e soluÃ§Ã£o

O objetivo Ã© permitir o registro e a consulta de equipamentos industriais por setor, com informaÃ§Ãµes sobre status operacional, temperatura atual e Ãºltima manutenÃ§Ã£o. A API centraliza os registros em um banco H2 persistente em arquivo; o app utiliza essa API para listar, cadastrar e consultar equipamentos.

**Entidade principal:** `Equipamento`.

| Campo | Tipo | Exemplo |
| --- | --- | --- |
| `id` | `Long` (gerado pelo backend) | `1` |
| `nome` | `String` | `Prensa Hidraulica 01` |
| `setor` | `String` | `Linha de Producao A` |
| `status` | `String` | `ATIVO` |
| `temperaturaAtual` | `Double` | `72.5` |
| `dataUltimaManutencao` | `LocalDate` (`yyyy-MM-dd`) | `2026-05-10` |

## 2. Integrantes

| Nome | RM |
| --- | --- |
| Pedro Alvarez Certo | 554603 |
| Caio Tadeu da Silva Faraleski | 558795 |
| Gustavo Demeis Peres | 555143 |
| Rodrigo Caruzzo Benevides | 554665 |
| Eduardo do Nascimento Souza | 558819 |

## 3. RepositÃ³rios do cÃ³digo

- **Backend Spring Boot:** https://github.com/RodrigoBenevides/metaindustria-backend-sprint1
- **Frontend Expo (repositÃ³rio desta entrega):** https://github.com/RodrigoBenevides/metaindustria-mobile-sprint4

Para reproduzir, clone **ambos**:

```bash
git clone https://github.com/RodrigoBenevides/metaindustria-backend-sprint1.git
git clone https://github.com/RodrigoBenevides/metaindustria-mobile-sprint4.git
```

## 4. PrÃ©-requisitos

- **Java 17** instalado e disponÃ­vel no terminal (`java -version`).
- **Maven** ou o **Maven Wrapper** (`mvnw`/`mvnw.cmd`) incluÃ­do no backend.
- **Node.js e npm** instalados (`node -v` e `npm -v`).
- **Expo** executado por `npx expo start` (nÃ£o requer instalaÃ§Ã£o global da CLI).
- Para abrir o app: **emulador Android** ou **celular com Expo Go**, na mesma rede do computador quando usar dispositivo fÃ­sico.
- Git, para clonar os repositÃ³rios.

Use **dois terminais**: um para o backend e outro para o app.

## 5. Executar o backend (porta 8080)

Abra um terminal na pasta `metaindustria-backend-sprint1`.

**Windows (PowerShell):**

```powershell
.\mvnw.cmd spring-boot:run
```

**macOS/Linux:**

```bash
./mvnw spring-boot:run
```

**Alternativa com Maven instalado:**

```bash
mvn spring-boot:run
```

A API estÃ¡ configurada na **porta 8080**. Com a aplicaÃ§Ã£o iniciada, abra:

- `http://localhost:8080/equipamentos` â€” lista os equipamentos em **JSON** (pode retornar `[]` se o banco estiver vazio).
- `http://localhost:8080/h2-console` â€” console do H2.

**PersistÃªncia H2 em arquivo:** o backend usa `jdbc:h2:file:./data/metaindustria`, definido em `src/main/resources/application.properties`; ao reiniciar o backend na mesma pasta, os registros sÃ£o mantidos no arquivo do banco. ConfiguraÃ§Ã£o do console: usuÃ¡rio `sa`, senha vazia e a mesma URL JDBC.

**CORS:** o `EquipamentoController` estÃ¡ anotado com `@CrossOrigin`.

## 6. Executar o frontend Expo

Em **outro terminal**, abra a pasta `metaindustria-mobile-sprint4` e execute:

```bash
npm install
npx expo start
```

Abra o app pelo emulador ou pelo Expo Go. Mantenha o backend iniciado para carregar os registros.

### Configurar a `BASE_URL` da API

O arquivo `src/services/api.ts` usa `EXPO_PUBLIC_API_URL` quando configurada. Caso contrÃ¡rio, utiliza o endereÃ§o padrÃ£o por plataforma:

| Onde o app roda | EndereÃ§o da API |
| --- | --- |
| Emulador Android (Android Studio) | `http://10.0.2.2:8080` |
| Simulador iOS no mesmo computador / execuÃ§Ã£o local compatÃ­vel | `http://localhost:8080` |
| Celular fÃ­sico (Android ou iPhone) | `http://IP_DO_COMPUTADOR:8080` |

**AtenÃ§Ã£o:** `localhost` em um celular fÃ­sico aponta para o prÃ³prio celular, nÃ£o para o computador. Para usar um celular fÃ­sico, descubra o IP local do computador que executa o backend, mantenha ambos na mesma rede e crie um arquivo **`.env.local` na raiz do frontend**:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Substitua `192.168.0.10` pelo IP real do computador. Depois de alterar o arquivo, reinicie o Expo, preferencialmente com `npx expo start -c`. A porta 8080 precisa estar acessÃ­vel pela rede local e liberada no firewall do computador.

## 7. Endpoints disponÃ­veis

| MÃ©todo | Rota | Finalidade | Usado no app |
| --- | --- | --- | --- |
| `GET` | `/equipamentos` | Listar equipamentos | Sim â€” lista |
| `GET` | `/equipamentos/{id}` | Consultar um equipamento | Sim â€” detalhe |
| `POST` | `/equipamentos` | Cadastrar equipamento | Sim â€” cadastro |
| `PUT` | `/equipamentos/{id}` | Atualizar equipamento | DisponÃ­vel na API, nÃ£o usado nas trÃªs telas |
| `DELETE` | `/equipamentos/{id}` | Remover equipamento | DisponÃ­vel na API, nÃ£o usado nas trÃªs telas |

**Exemplo do corpo de `POST /equipamentos`:**

```json
{
  "nome": "Furadeira CNC 04",
  "setor": "Linha de Producao B",
  "status": "ATIVO",
  "temperaturaAtual": 65.2,
  "dataUltimaManutencao": "2026-05-20"
}
```

## 8. Fluxo tela â†’ serviÃ§o â†’ endpoint

| Tela | Chamada da tela | Camada `src/services/` | RequisiÃ§Ã£o Ã  API |
| --- | --- | --- | --- |
| `ListaEquipamentosScreen` | `listar()` | `equipamentoService.ts` â†’ `api.ts` | `GET /equipamentos` |
| `CadastroEquipamentoScreen` | `criar(dados)` | `equipamentoService.ts` â†’ `api.ts` | `POST /equipamentos` |
| `DetalheEquipamentoScreen` | `buscarPorId(id)` | `equipamentoService.ts` â†’ `api.ts` | `GET /equipamentos/{id}` |

`api.ts` concentra a URL base, o timeout de 10 segundos e o header JSON. Os dados exibidos no fluxo principal vÃªm da API: **o frontend final nÃ£o utiliza mock para alimentar lista, cadastro ou detalhe**.

## 9. Como comprovar o cadastro do app na API

1. Com o backend em execuÃ§Ã£o, abra `http://localhost:8080/equipamentos` no navegador e observe o JSON atual (uma lista vazia tambÃ©m Ã© vÃ¡lida).
2. No aplicativo Expo, abra **Cadastrar equipamento**.
3. Preencha nome e setor; selecione o status e informe temperatura e data de manutenÃ§Ã£o. Toque em **Salvar equipamento**.
4. Retorne Ã  lista e veja o equipamento cadastrado. Abra sua ficha de **detalhe**, que busca os dados pela API.
5. Atualize `http://localhost:8080/equipamentos` no navegador. O equipamento cadastrado deve estar presente no JSON com um `id` atribuÃ­do pelo backend.
6. Para confirmar a persistÃªncia, encerre e reinicie a API na **mesma pasta** e consulte o GET novamente.

## 10. Como comprovar o erro com o backend desligado

1. Com a API funcionando, confirme que a lista do app carrega os dados reais.
2. No terminal do backend, pressione **Ctrl+C** e encerre o Spring Boot; mantenha o Expo aberto.
3. Volte ao aplicativo e provoque uma nova consulta (por exemplo, reabra a lista ou use **Tentar novamente** quando disponÃ­vel).
4. O aplicativo deve apresentar **Backend indisponÃ­vel** ou mensagem de consulta/cadastro indisponÃ­vel. Os dados **nÃ£o devem ser substituÃ­dos por uma lista de mock**.
5. Se desejar demonstrar a recuperaÃ§Ã£o, reinicie o backend e toque em **Tentar novamente**.

O erro deve ser exibido ao tentar obter os dados novamente; uma tela jÃ¡ carregada anteriormente nÃ£o realiza necessariamente uma nova requisiÃ§Ã£o atÃ© ser reaberta ou atualizada.

## 11. VÃ­deo demonstrativo (YouTube â€” NÃ£o listado)

**Link do vÃ­deo da Sprint 4:** **[INSERIR AQUI O LINK REAL DO VÃDEO FINAL PUBLICADO NO YOUTUBE]**

O vÃ­deo final deve ter **atÃ© cinco minutos**, ficar como **NÃ£o listado** (nÃ£o Privado) e demonstrar, nesta ordem:

1. README e links de frontend/backend no GitHub.
2. Backend iniciado e `GET /equipamentos` retornando JSON.
3. Aplicativo Expo listando os dados da API.
4. Cadastro pelo app e registro novo aparecendo no GET do backend.
5. Encerramento da API pelo terminal.
6. Nova tentativa de carregamento no aplicativo com mensagem de erro visÃ­vel e **sem fallback para dados mockados**.

**Antes de entregar:** substitua o texto entre colchetes pelo link pÃºblico de acesso ao vÃ­deo NÃ£o listado. **NÃ£o envie a entrega final com este campo pendente.**
