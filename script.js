/**
 * Motor de Análise CacauV1.1 - Projeto Aletheia
 * Desenvolvido para o Oráculo de Verificação Elo Tech
 */
function analisarNoticiaAletheia(textoBruto) {
    
    // 1. LIMPEZA AUTOMÁTICA DE RUÍDO (Remove assinaturas e quebras repetidas)
    let textoLimpo = textoBruto
        .replace(/—\s*Foto:[^\n]+/gi, '')
        .replace(/—\s*REUTERS[^\n]+/gi, '')
        .replace(/GIF\s*-[^\n]+/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

    let linhas = textoLimpo.split('\n');
    let linhasUnicas = [...new Set(linhas.map(l => l.trim()))].filter(l => l.length > 0);
    textoLimpo = linhasUnicas.join('\n');

    // 2. DETECÇÃO DE FONTES E ENTIDADES CITADAS (+25 Pontos)
    const termosConfiaveis = [
        'universidade', 'onu', 'reuters', 'g1', 'sbt', 'cnn', 'jornal nacional',
        'pesquisador', 'cientista', 'geólogo', 'especialista', 'planet labs', 
        'agência', 'professor', 'estudo', 'relatório', 'distrito', 'oficial', 'autoridades',
        'governo', 'ministério', 'defesa civil', 'polícia', 'bombeiros'
    ];
    let fontesEncontradas = 0;
    termosConfiaveis.forEach(termo => {
        if (new RegExp(termo, 'gi').test(textoLimpo)) fontesEncontradas++;
    });

    // 3. CAUTELA JORNALÍSTICA (+15 Pontos)
    // Notícias sérias usam verbos de apuração em vez de afirmações absolutistas
    const termosCautela = [
        'pode ter', 'ainda não está claro', 'estão sendo investigadas', 
        'parecem indicar', 'segundo', 'relatou', 'informou', 'apontaram', 'possível', 'estimativa'
    ];
    let indiceCautela = 0;
    termosCautela.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceCautela++;
    });

    // 4. CONTEXTO FATUAL DE TRAGÉDIA / DESASTRE (Garante nota alta em matérias difíceis)
    // Se cita tragédia mas tem fontes/cautela, é jornalismo real, não boato!
    const termosTragedia = [
        'mortes', 'mortos', 'vítimas', 'deslizamento', 'avalanche', 
        'resgate', 'desaparecidos', 'corpos', 'desastre', 'tragédia', 'feridos', 'acidente'
    ];
    let indiceTragedia = 0;
    termosTragedia.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) indiceTragedia++;
    });

    // 5. TRAVAS DE FAKE NEWS / GOLPE (Penaliza APENAS correntes apelativas)
    const termosAlerta = [
        'repassem', 'espalhem', 'a mídia esconde', 'não querem que você saiba', 
        'compartilhe antes que apaguem', 'cura milagrosa', 'compartilhem', 'urgente:'
    ];
    let indiceAlerta = 0;
    termosAlerta.forEach(termo => {
         if(textoLimpo.toLowerCase().includes(termo)) indiceAlerta++;
    });

    // 6. CÁLCULO DE CREDIBILIDADE (ORQUESTRADOR)
    let pontuacao = 50; // Inicia neutro

    // Bonificações por fontes e tom jornalístico
    if (fontesEncontradas >= 2) pontuacao += 25; 
    else if (fontesEncontradas === 1) pontuacao += 15;

    if (indiceCautela >= 2) pontuacao += 15;

    // Se é um relato de tragédia respaldado por fontes oficiais
    if (indiceTragedia >= 1 && fontesEncontradas >= 1) {
        pontuacao += 20; 
    }

    // Penalidade por correntes de WhatsApp / pânico induzido
    if (indiceAlerta >= 1) pontuacao -= 40; 

    // Limites matemáticos entre 0 e 100
    pontuacao = Math.min(Math.max(pontuacao, 0), 100);

    let status = "";
    let classeAlerta = "";

    if (pontuacao >= 70) {
        status = "<b>Conteúdo Genuíno:</b> O Orquestrador detectou fortes indícios de ser um relato jornalístico verificado. O texto apresenta fontes citadas e linguagem estruturada típica de portais de notícias (apresentando apuração fatual ou relatórios de emergência).";
        classeAlerta = "sucesso";
    } else if (pontuacao >= 40) {
        status = "<b>Atenção Necessária:</b> O conteúdo relata acontecimentos, mas carece de múltiplas fontes oficiais citadas no texto. Recomendamos verificar em portais de notícias conhecidos para confirmação dos fatos.";
        classeAlerta = "aviso";
    } else {
        status = "<b>ALERTA CRÍTICO:</b> O Orquestrador marcou o conteúdo como FRAUDE. Trata-se de uma tática de engenharia social ou pânico digital, usando linguagem típica de correntes sem respaldo oficial.";
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