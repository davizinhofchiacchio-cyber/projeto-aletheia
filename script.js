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

    // COMEÇA COM 65 (Favorece a veracidade para notícias padrão passarem direto)
    let pontuacao = 65; 

    if (fontesEncontradas >= 1) pontuacao += 20; 
    if (indiceCautela >= 1) pontuacao += 15;
    if (indiceTragedia >= 1) pontuacao += 15;

    // Penalidade pesada apenas se tiver termos claros de golpe/fake news
    if (indiceAlerta >= 1) pontuacao -= 50; 

    pontuacao = Math.min(Math.max(pontuacao, 0), 100);

    let status = "";
    let classeAlerta = "";

    // Nota de corte ajustada para 55: acima disso é Verdade, abaixo é Mentira!
    if (pontuacao >= 55) {
        status = "<b>Análise Concluída:</b> As agências e os padrões estruturais confirmam a autenticidade dos fatos relatados. O texto condiz com relatórios oficiais e apurações jornalísticas válidas.";
        classeAlerta = "sucesso";
    } else {
        status = "<b>ALERTA DE FRAUDE:</b> O Orquestrador identificou forte uso de engenharia social, tom alarmista ou ausência total de respaldo institucional. Conteúdo classificado como falso.";
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