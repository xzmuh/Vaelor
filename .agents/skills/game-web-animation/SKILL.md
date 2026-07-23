$d=".agents\skills\game-web-animation"; New-Item -ItemType Directory -Force $d | Out-Null; @'
---
name: game-web-animation
description: Constrói e valida experiências cinematográficas para sites de jogos, gachas, personagens, regiões e mundos de fantasia.
---

# Game Web Animation

## Objetivo

Criar sites promocionais de jogos com sensação de profundidade, narrativa visual, movimento cinematográfico e acabamento de game key art.

Não criar landing page SaaS genérica.

## Processo obrigatório

Antes de editar:

1. Inspecione package.json.
2. Inspecione os componentes, assets e estilos existentes.
3. Identifique exatamente quais efeitos foram pedidos.
4. Escolha a menor stack capaz de produzir esses efeitos.
5. Informe em poucas linhas:
   - efeito;
   - tecnologia;
   - arquivo;
   - motivo.

Depois implemente sem pedir nova confirmação, salvo bloqueio real.

## Escolha de tecnologia

### GSAP + ScrollTrigger

Use para:

- seções fixadas;
- scrub;
- pin;
- timelines longas;
- parallax por camadas;
- transições entre regiões;
- vídeo ligado ao scroll;
- sequência de frames ligada ao scroll;
- entrada e saída sincronizada de elementos.

Não use GSAP apenas para hover simples.

### Anime.js

Use para:

- SVG;
- runas;
- símbolos mágicos;
- logos;
- máscaras;
- textos;
- timelines DOM pequenas e médias;
- microinterações estilizadas.

Não use Anime.js para substituir ScrollTrigger em experiências complexas de scroll.

### Motion

Use para:

- entrada e saída de componentes React;
- menus;
- modais;
- cards;
- hover;
- drag;
- transições de layout.

Não use Motion como motor principal de uma experiência cinematográfica longa.

### Three.js ou React Three Fiber

Use apenas quando houver:

- câmera 3D real;
- modelos 3D;
- cenário navegável;
- iluminação dinâmica;
- partículas 3D;
- shaders;
- profundidade real.

Não adicionar Three.js para animar uma imagem ou vídeo plano.

### PixiJS

Use para:

- partículas 2D em grande quantidade;
- sprites;
- filtros;
- fumaça;
- energia;
- distorção;
- glow;
- composição 2D acelerada por GPU.

### Canvas 2D

Use para:

- sequência de imagens;
- frame-by-frame controlado pelo scroll;
- efeitos simples que não exigem WebGL.

### Vídeo

Use quando a cena já estiver renderizada:

- câmera entrando no cenário;
- cinemática curta;
- transição de região;
- movimento impossível de recriar apenas com uma imagem.

### CSS

Use apenas para:

- hover simples;
- estados pequenos;
- transições discretas;
- animações ambientais muito leves.

Não usar CSS como substituto de uma interação pedida com scroll, vídeo, canvas ou WebGL.

## Direção visual

Toda cena deve ser construída em camadas:

1. céu;
2. fundo distante;
3. cenário intermediário;
4. elemento principal;
5. primeiro plano;
6. partículas;
7. interface.

Camadas próximas devem se mover mais que camadas distantes.

Não mover todas as camadas na mesma velocidade.

## Padrões visuais obrigatórios

- movimentos suaves;
- composição limpa;
- foco visual claro;
- parallax sutil;
- transições com continuidade;
- animação com propósito;
- leitura fácil;
- sensação de escala;
- profundidade atmosférica.

## Padrões proibidos

- fade-up em tudo;
- animações genéricas iguais;
- cards SaaS;
- gradiente genérico;
- movimento aleatório;
- biblioteca instalada sem uso;
- importar várias libs para o mesmo efeito;
- comentários no lugar da implementação;
- placeholders como solução final;
- alterar o design sem necessidade;
- adicionar 3D sem benefício real.

## React e Next.js

Quando houver acesso ao DOM, vídeo, canvas ou WebGL:

- use "use client";
- use refs;
- evite querySelector global;
- faça cleanup;
- evite inicialização duplicada;
- trate resize;
- não use APIs do navegador no servidor;
- carregue experiências pesadas de forma dinâmica quando fizer sentido.

## Dependências

Antes de instalar:

1. verifique se já existe biblioteca adequada;
2. consulte a documentação oficial;
3. instale somente o necessário;
4. confirme no package.json;
5. importe no arquivo correto;
6. remova dependências não utilizadas.

Uma biblioteca só conta como usada quando produz efeito visual real.

## Validação obrigatória

Antes de concluir:

1. execute o projeto;
2. abra a página no navegador;
3. teste scroll;
4. teste interação;
5. teste resize;
6. teste desktop e mobile;
7. verifique console;
8. confirme que a animação está visível;
9. corrija problemas;
10. remova imports mortos.

## Critério de pronto

A tarefa não está pronta apenas porque compila.

Só está pronta quando:

- o efeito solicitado funciona visualmente;
- a biblioteca escolhida está realmente importada;
- o comportamento foi testado;
- não há erros no console;
- o layout não quebrou;
- existe cleanup;
- reduced motion foi considerado;
- dependências inúteis foram removidas.

## Entrega

Ao finalizar, informe apenas:

- biblioteca usada;
- arquivos alterados;
- efeito implementado;
- teste realizado;
- problemas corrigidos.
'@ | Set-Content "$d\SKILL.md" -Encoding UTF8; code "$d\SKILL.md"