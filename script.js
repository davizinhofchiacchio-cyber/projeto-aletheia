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

    // Ponto de partida neutro/baixo (40 pontos). Precisa provar que é verdade!
    let pontuacao = 40; 

    // Bonificações se encontrar indícios reais de jornalismo
    if (fontesEncontradas >= 1) pontuacao += 25; 
    if (indiceCautela >= 1) pontuacao += 15;
    if (indiceTragedia >= 1 && fontesEncontradas >= 1) pontuacao += 20;

    // Penalidade pesada se usar táticas de fake news / caça-cliques
    if (indiceAlerta >= 1) pontuacao -= 40; 

    pontuacao = Math.min(Math.max(pontuacao, 0), 100);

    let status = "";
    let classeAlerta = "";

    // Nota de corte: 60. Se passar de 60 é verdade, se ficar abaixo é mentira!
    if (pontuacao >= 60) {
        status = "<b>Análise Concluída:</b> O Orquestrador identificou fontes oficiais e estrutura compatível com relatórios jornalísticos verificados. Conteúdo validado como autêntico.";
        classeAlerta = "sucesso";
    } else {
        status = "<b>ALERTA DE FRAUDE:</b> O Orquestrador detectou falta de fontes institucionais confiáveis ou uso de linguagem apelativa/alarmista. Conteúdo classificado como falso.";
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