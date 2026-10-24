# Metaindústria — Mobile Dev | Sprint 4 (Entrega Final)

Aplicativo de monitoramento e cadastro de equipamentos industriais, desenvolvido para a disciplina **Advanced Programming & Mobile Dev**. A solução integra um **backend REST com Java/Spring Boot** e um **aplicativo mobile com React Native, Expo e TypeScript**.

## 1. Problema e solução

O objetivo é permitir o registro e a consulta de equipamentos industriais por setor, com informações sobre status operacional, temperatura atual e última manutenção. A API centraliza os registros em um banco H2 persistente em arquivo; o app utiliza essa API para listar, cadastrar e consultar equipamentos.

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

## 3. Repositórios do código

- **Backend Spring Boot:** https://github.com/RodrigoBenevides/metaindustria-backend-sprint1
- **Frontend Expo (repositório desta entrega):** https://github.com/RodrigoBenevides/metaindustria-mobile-sprint4

Para reproduzir, clone **ambos**:

```bash
git clone https://github.com/RodrigoBenevides/metaindustria-backend-sprint1.git
git clone https://github.com/RodrigoBenevides/metaindustria-mobile-sprint4.git
```

## 4. Pré-requisitos

- **Java 17** instalado e disponível no terminal (`java -version`).
- **Maven** ou o **Maven Wrapper** (`mvnw`/`mvnw.cmd`) incluído no backend.
- **Node.js e npm** instalados (`node -v` e `npm -v`).
- **Expo** executado por `npx expo start` (não requer instalação global da CLI).
- Para abrir o app: **emulador Android** ou **celular com Expo Go**, na mesma rede do computador quando usar dispositivo físico.
- Git, para clonar os repositórios.

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

A API está configurada na **porta 8080**. Com a aplicação iniciada, abra:

- `http://localhost:8080/equipamentos` — lista os equipamentos em **JSON** (pode retornar `[]` se o banco estiver vazio).
- `http://localhost:8080/h2-console` — console do H2.

**Persistência H2 em arquivo:** o backend usa `jdbc:h2:file:./data/metaindustria`, definido em `src/main/resources/application.properties`; ao reiniciar o backend na mesma pasta, os registros são mantidos no arquivo do banco. Configuração do console: usuário `sa`, senha vazia e a mesma URL JDBC.

**CORS:** o `EquipamentoController` está anotado com `@CrossOrigin`.

## 6. Executar o frontend Expo

Em **outro terminal**, abra a pasta `metaindustria-mobile-sprint4` e execute:

```bash
npm install
npx expo start
```

Abra o app pelo emulador ou pelo Expo Go. Mantenha o backend iniciado para carregar os registros.

### Configurar a `BASE_URL` da API

O arquivo `src/services/api.ts` usa `EXPO_PUBLIC_API_URL` quando configurada. Caso contrário, utiliza o endereço padrão por plataforma:

| Onde o app roda | Endereço da API |
| --- | --- |
| Emulador Android (Android Studio) | `http://10.0.2.2:8080` |
| Simulador iOS no mesmo computador / execução local compatível | `http://localhost:8080` |
| Celular físico (Android ou iPhone) | `http://IP_DO_COMPUTADOR:8080` |

**Atenção:** `localhost` em um celular físico aponta para o próprio celular, não para o computador. Para usar um celular físico, descubra o IP local do computador que executa o backend, mantenha ambos na mesma rede e crie um arquivo **`.env.local` na raiz do frontend**:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Substitua `192.168.0.10` pelo IP real do computador. Depois de alterar o arquivo, reinicie o Expo, preferencialmente com `npx expo start -c`. A porta 8080 precisa estar acessível pela rede local e liberada no firewall do computador.

## 7. Endpoints disponíveis

| Método | Rota | Finalidade | Usado no app |
| --- | --- | --- | --- |
| `GET` | `/equipamentos` | Listar equipamentos | Sim — lista |
| `GET` | `/equipamentos/{id}` | Consultar um equipamento | Sim — detalhe |
| `POST` | `/equipamentos` | Cadastrar equipamento | Sim — cadastro |
| `PUT` | `/equipamentos/{id}` | Atualizar equipamento | Disponível na API, não usado nas três telas |
| `DELETE` | `/equipamentos/{id}` | Remover equipamento | Disponível na API, não usado nas três telas |

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

## 8. Fluxo tela → serviço → endpoint

| Tela | Chamada da tela | Camada `src/services/` | Requisição à API |
| --- | --- | --- | --- |
| `ListaEquipamentosScreen` | `listar()` | `equipamentoService.ts` → `api.ts` | `GET /equipamentos` |
| `CadastroEquipamentoScreen` | `criar(dados)` | `equipamentoService.ts` → `api.ts` | `POST /equipamentos` |
| `DetalheEquipamentoScreen` | `buscarPorId(id)` | `equipamentoService.ts` → `api.ts` | `GET /equipamentos/{id}` |

`api.ts` concentra a URL base, o timeout de 10 segundos e o header JSON. Os dados exibidos no fluxo principal vêm da API: **o frontend final não utiliza mock para alimentar lista, cadastro ou detalhe**.

## 9. Como comprovar o cadastro do app na API

1. Com o backend em execução, abra `http://localhost:8080/equipamentos` no navegador e observe o JSON atual (uma lista vazia também é válida).
2. No aplicativo Expo, abra **Cadastrar equipamento**.
3. Preencha nome e setor; selecione o status e informe temperatura e data de manutenção. Toque em **Salvar equipamento**.
4. Retorne à lista e veja o equipamento cadastrado. Abra sua ficha de **detalhe**, que busca os dados pela API.
5. Atualize `http://localhost:8080/equipamentos` no navegador. O equipamento cadastrado deve estar presente no JSON com um `id` atribuído pelo backend.
6. Para confirmar a persistência, encerre e reinicie a API na **mesma pasta** e consulte o GET novamente.

## 10. Como comprovar o erro com o backend desligado

1. Com a API funcionando, confirme que a lista do app carrega os dados reais.
2. No terminal do backend, pressione **Ctrl+C** e encerre o Spring Boot; mantenha o Expo aberto.
3. Volte ao aplicativo e provoque uma nova consulta (por exemplo, reabra a lista ou use **Tentar novamente** quando disponível).
4. O aplicativo deve apresentar **Backend indisponível** ou mensagem de consulta/cadastro indisponível. Os dados **não devem ser substituídos por uma lista de mock**.
5. Se desejar demonstrar a recuperação, reinicie o backend e toque em **Tentar novamente**.

O erro deve ser exibido ao tentar obter os dados novamente; uma tela já carregada anteriormente não realiza necessariamente uma nova requisição até ser reaberta ou atualizada.

## 11. Vídeo demonstrativo (YouTube — Não listado)

**Link do vídeo da Sprint 4:** **https://youtu.be/Vgtqn9sYCCQ**

O vídeo final deve ter **até cinco minutos**, ficar como **Não listado** (não Privado) e demonstrar, nesta ordem:

1. README e links de frontend/backend no GitHub.
2. Backend iniciado e `GET /equipamentos` retornando JSON.
3. Aplicativo Expo listando os dados da API.
4. Cadastro pelo app e registro novo aparecendo no GET do backend.
5. Encerramento da API pelo terminal.
6. Nova tentativa de carregamento no aplicativo com mensagem de erro visível e **sem fallback para dados mockados**.

**Antes de entregar:** substitua o texto entre colchetes pelo link público de acesso ao vídeo Não listado. **Não envie a entrega final com este campo pendente.**
