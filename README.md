# .NetCoreApiProject
Aplicação feita em asp.net core + postgresql(Backend) + Angular js(Frontend)

------------------------------------

	Projeto para fazer upload de arquivos (.txt e .log) e gravar no Banco de dados(BD)

------------------------------------

	Criação backend com ASP.NET CORE 2.1 (VisualStudio 2017) - web API + Banco de dados PostgreSQL
		Instalaçao de pacotes pelo Nuget: 
			Microsoft.AspNetCore.Cors versao 2.1.1 - para autorizaçao de acesso do frontend
			Npgsql.EntityFrameworkCore.PostgreSQL versao 2.1.0 - Para acesso ao banco de dados 


		Classe Program.cs
			Tem o método Main() que faz a execução do projeto(WebHost). Dentro do Main é chamado a classe Startup.
			
		Classe Startup.cs
			Configura serviços e o pipeline de solicitação do aplicativo.
			Método ConfigureServices() que faz a configuração dos serviços do aplicativo e que serão reutilizável em todo o aplicativo por meio de injeção de dependência. 
			Método Configure() para criar o pipeline de processamento das solicitações do aplicativo (HTTP request).
		
		appsettings.json
			Tem a string de conexão com o banco PostgreSQL (ConnectionStrings).
		
		
		Pasta Models
			Classe Arquivo.cs:
				Classe entidade, é o modelo de dados da tabela "arquivo" do banco de dados.
				
			Classe ArquivosContext.cs: DbContext EntityFramework	
				Responsável pelo contexto dos dados, controla as mudanças feitas nas entidades, incluindo o estado das entidades e suas conexões. 
				Este contexto é usado para realizar todas as ações necessárias para o backend do nosso aplicativo por Injeção de dependencias.
				Método construtor ArquivosContext().
				Propriedade DbSet<Arquivo> Arquivos.
				
			SubPasta Interfaces e subPasta Repositories
				Interface IDadosRep.cs
				Classe DadosRep.cs
				
				* Cuida da abstração, encapsulamento dos métodos que irão acessar o banco de dados e faz persistência dos dados.
				

		Pasta Controllers
			Classe ArquivoController.cs
				Classe que tem a configuração Route, controlea os métodos CRUD e os verbos usando anotações HTTP(HttpPost, HttpGet, HttpPut, HttpDelete). "Rest API"
				
				Método GetArquivos(): [HttpGet]
					Retorna todas as linhas da tabela arquivo do BD.
					
				Método GetDownloadArquivo(id)
					Retorna o arquivo de um ID específico gravado no BD.
					
				GetArquivo(id): [HttpGet("{id}")]
					Retorna linha do ID passado no BD.
					
				Método PutArquivo(): [HttpPut("{id}")]
					Atualiza os dados de uma linha específica pelo ID no BD.
					
				Método PostArquivo(): [HttpPost]
					Insere uma nova linha na tabela arquivo no BD.
					
				Método BatchArquivo() : [HttpPost]
					Insere varias linhas na tabela arquivo no BD.
					
				Método DeleteArquivo(id): [HttpDelete("{id}")]
					Apaga uma linha especificada pelo ID do BD.
				
		
		Pasta Migrations
			Migration que migra a classe arquivo.cs para o banco tornando a classe em tabela "arquivo".
			Comandos para criação e atualização do BD:
				Abra o console gerenciador pacote nuget
				PM> Add-Migration "createIni".
				Criado a pasta Migrations e seus arquivos de transição.
				Depois atualize a base de dados
				PM> Update-database	
				
------------------------------------

	Criação frontend Angular TypeScript - (VS Code)
		Arquivo angular.json
			Contém os caminhos dos css utilizados para criação da interface. Usado PRIMENG.
			
		Arquivos dentro da pasta APP. (src/app/)
			Arquivo app.module.ts
				Contém a importação dos modulos que serão usados em todo projeto.
				
			Arquivo app.component.ts
				Componente principal do frontend
				
			Arquivo app.component.html
				Html principal do nosso projeto
				
			SubPasta arquivos
				Contém os componentes para montagem da tela dos uploads dos arquivos.
				
				arquivos.component.ts
					Contém a lógica e os eventos que a pagina HTML irá retornar.
					
				arquivos.component.html
					Contém a estrutura HTML da tela de arquivos.
					
			SubPasta Models
				Contém o modelo de dados da tabela "arquivo" do banco de dados.
				arquivo.ts
				
			SubPasta services
				arquivo.service.ts
					Contém os serviços que faz a chamada das rotas do backend. HTTP request(HttpPost, HttpGet, HttpPut, HttpDelete)
		
		
------------------------------------
	
	Script Banco POSTGRESQL
	
	create table Arquivos (
		Id serial primary key,
		Nome varchar(30) not null,
		DtCriacao timestamp not null,
		Arquivo bytea not null
	);
	
	create index index_arquivos on Arquivos (Id, Nome, DtCriacao);
			
			
			
