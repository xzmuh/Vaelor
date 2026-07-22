# Instruções para Codex e Ferramentas de IA

Este projeto usa a documentação como contexto permanente. O código deve respeitar o universo registrado nos arquivos Markdown.

Antes de criar ou alterar uma seção narrativa, leia:

1. `docs/00_PROJECT_CONTEXT.md`
2. os documentos relevantes em `docs/01_world/`
3. os documentos relevantes em `docs/02_narrative/`
4. `docs/04_production/01_CANON_AND_OPEN_QUESTIONS.md`

Não invente fatos para preencher layout.

Quando o conteúdo ainda não estiver definido, use uma destas abordagens:

- placeholder explícito;
- texto conceitual já aprovado;
- seção temporariamente oculta;
- comentário indicando decisão pendente.

Não crie automaticamente:

- continentes;
- cidades;
- reinos;
- sobrenomes;
- armas;
- títulos;
- religiões;
- nomes de facções;
- causas do Cisma;
- respostas para as Alturas;
- respostas para as Fendas;
- origem da Faísca;
- novas Afinidades.

Toda informação narrativa usada na interface deve vir de uma estrutura central de conteúdo. Evite escrever lore diretamente em múltiplos componentes.

Ao criar componentes, mantenha separação entre:

- conteúdo;
- mídia;
- layout;
- animação;
- estado de interação.

O site precisa aceitar troca de imagens e vídeos sem reconstrução completa.

Use nomes internos descritivos quando um nome de lore ainda não existir. Exemplo: `heightsExplorers` é aceitável internamente. Exibir “Exploradores das Alturas” como nome oficial público não é aceitável sem aprovação.

O site deve priorizar experiência, mas não esconder acessibilidade. Respeite redução de movimento, controle de áudio, contraste, teclado e fallback de vídeo.

Quando uma nova decisão for aprovada, atualize primeiro a documentação e depois o código.

A documentação é a fonte da verdade. O código é uma implementação dela.
