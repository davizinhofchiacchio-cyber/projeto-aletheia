/**
 * Motor de Análise CacauV1.1 - Projeto Aletheia
 */
function analisarNoticiaAletheia(textoBruto) {
    
    // 1. LIMPEZA AUTOMÁTICA DE RUÍDO
    let textoLimpo = textoBruto
        .replace(/—\s*Foto:[^\n]+/gi, '')
        .replace(/—\s*REUTERS[^\n]+/gi, '')
        .replace(/GIF\s*-[^\n]+/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

    let linhas = textoLimpo.split('\n');
    let linhasUnicas = [...new Set(linhas.map(l => l.trim()))].filter(l => l.length > 0);
    textoLimpo = linhasUnicas.join('\n');

    // 2. DETECÇÃO DE FONTES E ENTIDADES (+25 pontos)
    const termosConfiaveis = [
        'universidade', 'onu', 'reuters', 'g1', 'sbt', 'cnn', 'jornal nacional',
        'pesquisador', 'cientista', 'geólogo', 'especialista', 'planet labs', 
        'agência', 'professor', 'estudo', 'relatório', 'distrito', 'oficial', 'autoridades'
    ];
    let fontesEncontradas = 0;
    termosConfiaveis.forEach(termo => {
        if (new RegExp(termo, 'gi').test(textoLimpo)) fontesEncontradas++;
    });

    // 3. CAUTELA JORNALÍSTICA (+15 pontos)
    const termosCautela = [
        'pode ter', 'ainda não está claro', 'estão sendo investigadas', 
        'parecem indicar', 'segundo', 'relatou', 'informou', 'apontaram', 'possível', 'estimativa'
    ];
    let indiceCautela = 0;
    termosCautela.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceCautela++;
    });

    // 4. CONTEXTO FATUAL DE TRAGÉDIA/DESASTRE (NOVO: Valida a notícia real)
    // Se o texto tem esses termos, é jornalismo relatando fatos difíceis, não boato.
    const termosTragedia = [
        'mortes', 'mortos', 'vítimas', 'deslizamento', 'avalanche', 
        'resgate', 'desaparecidos', 'corpos', 'desastre', 'tragédia', 'feridos'
    ];
    let indiceTragedia = 0;
    termosTragedia.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceTragedia++;
    });

    // 5. LINGUAGEM DE FAKE NEWS / GOLPE (Agora penaliza APENAS táticas enganosas de fato)
    const termosAlerta = [
        'repassem', 'espalhem', 'a mídia esconde', 'não querem que você saiba', 
        'compartilhe antes que apaguem', 'cura milagrosa', 'compartilhem', 'urgente:'
    ];
    let indiceAlerta = 0;
    termosAlerta.forEach(termo => {
         if(textoLimpo.toLowerCase().includes(termo)) indiceAlerta++;
    });

    // 6. CÁLCULO FINAL DE CREDIBILIDADE (ORQUESTRADOR)
    let pontuacao = 50; // Começa neutro

    if (fontesEncontradas >= 2) pontuacao += 25; 
    if (indiceCautela >= 2) pontuacao += 15;
    
    // Se relata uma tragédia MAS tem fontes, o sistema valida como notícia real de alta credibilidade
    if (indiceTragedia >= 2 && fontesEncontradas >= 1) {
        pontuacao += 20; 
    }

    // Só retira os pontos se o texto usar frases clássicas de tios do WhatsApp ("repassem", "a mídia esconde")
    if (indiceAlerta >= 1) pontuacao -= 40; 

    // Trava matemática para manter entre 0 e 100
    pontuacao = Math.min(Math.max(pontuacao, 0), 100);

    let status = "";
    let classeAlerta = "";

    if (pontuacao >= 70) {
        status = "<b>Conteúdo Genuíno:</b> O Orquestrador detectou fortes indícios de ser um relato jornalístico verificado. O texto apresenta fontes citadas e linguagem estruturada típica de portais e agências (reportando fatos ou apurações de última hora).";
        classeAlerta = "sucesso";
    } else if (pontuacao >= 40) {
        status = "<b>Atenção Necessária:</b> O conteúdo relata acontecimentos, mas carece de múltiplas fontes oficiais citadas no texto. Recomendamos verificar em portais de notícias como G1, CNN ou SBT para confirmação.";
        classeAlerta = "aviso";
    } else {
        status = "<b>ALERTA CRÍTICO:</b> O Orquestrador marcou o conteúdo como FRAUDE. Trata-se de uma tática de engenharia social estruturada para gerar pânico ou cliques enganosos, usando linguagem de corrente de mensagens sem respaldo oficial.";
        classeAlerta = "perigo";
    }

    return {
        textoLimpo: textoLimpo,
        totalFontesDetectadas: fontesEncontradas,
        nivelCautelaJornalistica: indiceCautela,
        scoreCredibilidade: pontuacao,
        diagnostico: status,
        tipo: classeAlerta
    };
}