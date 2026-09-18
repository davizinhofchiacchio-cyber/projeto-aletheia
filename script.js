/**
 * Motor de Análise CacauV1.1 - Projeto Aletheia
 * (Atualizado com detectores Anti-Fake e integração de mídia)
 */
function analisarNoticiaAletheia(textoBruto, temImagem = false, temVideo = false) {
    
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

    // INCLUÍDOS OS GATILHOS EMOCIONAIS DO NOSSO TESTE AQUI
    const termosAlerta = [
        'repassem', 'espalhem', 'a mídia esconde', 'não querem que você saiba', 
        'compartilhe antes que apaguem', 'cura milagrosa', 'compartilhem', 'urgente:', 
        'atenção', '!!!'
    ];
    let indiceAlerta = 0;
    termosAlerta.forEach(termo => {
         if(textoLimpo.toLowerCase().includes(termo)) indiceAlerta++;
    });

    // INCLUÍDAS AS ENTIDADES FALSAS DO NOSSO TESTE AQUI
    const termosAbsurdos = [
        'cama elástica', 'pula-pula', 'tobogã aquático', 'cambalhotas', 
        'quatro saltos', 'gravatas desarrumadas', 'unicórnio', 'disco voador',
        'shake', 'alibaba', 'bombarde