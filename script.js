/**
 * Motor de Análise CacauV1.1 - Projeto Aletheia
 */
function analisarNoticiaAletheia(textoBruto) {
    
    let textoLimpo = textoBruto
        .replace(/—\s*Foto:[^\n]+/gi, '')
        .replace(/—\s*REUTERS[^\n]+/gi, '')
        .replace(/GIF\s*-[^\n]+/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

    let linhas = textoLimpo.split('\n');
    let linhasUnicas = [...new Set(linhas.map(l => l.trim()))].filter(l => l.length > 0);
    textoLimpo = linhasUnicas.join('\n');

    const termosConfiaveis = [
        'universidade', 'onu', 'reuters', 'g1', 'sbt', 'cnn', 'jornal nacional',
        'pesquisador', 'cientista', 'geólogo', 'especialista', 'planet labs', 
        'agência', 'professor', 'estudo', 'relatório', 'distrito', 'oficial', 'autoridades',
        'governo', 'ministério', 'defesa civil', 'polícia', 'bombeiros', 'segundo'
    ];
    let fontesEncontradas = 0;
    termosConfiaveis.forEach(termo => {
        if (new RegExp(termo, 'gi').test(textoLimpo)) fontesEncontradas++;
    });

    const termosCautela = [
        'pode ter', 'ainda não está claro', 'estão sendo investigadas', 
        'parecem indicar', 'relatou', 'informou', 'apontaram', 'possível', 'estimativa'
    ];
    let indiceCautela = 0;
    termosCautela.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceCautela++;
    });

    const termosTragedia = [
        'mortes', 'mortos', 'vítimas', 'deslizamento', 'avalanche', 
        'resgate', 'desaparecidos', 'corpos', 'desastre', 'tragédia', 'feridos', 'acidente'
    ];
    let indiceTragedia = 0;
    termosTragedia.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceTragedia++;
    });

    const termosAlerta = [
        'repassem', 'espalhem', 'a mídia esconde', 'não querem que você saiba', 
        'compartilhe antes que apaguem', 'cura milagrosa', 'compartilhem', 'urgente:'
    ];
    let indiceAlerta = 0;
    termosAlerta.forEach(termo => {
         if(textoLimpo.toLowerCase().includes(termo)) indiceAlerta++;
    });

    // NOVO: DETECÇÃO DE SÁTIRA / ABSURDO (Pega notícias de humor tipo Sensacionalista)
    const termosAbsurdos = [
        'cama elástica', 'pula-pula', 'tobogã aquático', 'cambalhotas', 
        'quatro saltos', 'gravatas desarrumadas', 'unicórnio', 'disco voador'
    ];
    let indiceAbsurdo = 0;
    termosAbsurdos.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceAbsurdo++;
    });

    // Ponto de partida neutro
    let pontuacao = 40; 

    if (fontesEncontradas >= 1) pontuacao += 25; 
    if (indiceCautela >= 1) pontuacao += 15;
    if (indiceTragedia >= 1 && fontesEncontradas >= 1) pontuacao += 20;

    // Penalidades
    if (indiceAlerta >= 1) pontuacao -= 40; 
    
    // Se o texto fala de absurdos físicos óbvios, penaliza pesadamente para marcar como mentira/sátira
    if (indiceAbsurdo >= 1) pontuacao -= 60; 

    pontuacao = Math.min(Math.max(pontuacao, 0), 100);

    let status = "";
    let classeAlerta = "";

    if (pontuacao >= 60) {
        status = "<b>Análise Concluída:</b> O Orquestrador identificou fontes oficiais e estrutura compatível com relatórios jornalísticos verificados. Conteúdo validado como autêntico.";
        classeAlerta = "sucesso";
    } else {
        status = "<b>ALERTA DE FRAUDE / SÁTIRA:</b> O Orquestrador detectou elementos de humor, impossibilidade física ou ausência de respaldo institucional. Conteúdo classificado como falso ou sátira.";
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