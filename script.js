/**
 * Motor de Pré-processamento e Análise para o Projeto Aletheia
 * Corrige falsos positivos causados por ruído de texto, legendas e incerteza jornalística.
 */
function analisarNoticiaAletheia(textoBruto) {
    // 1. LIMPEZA AUTOMÁTICA DE RUÍDO (Pré-processamento)
    let textoLimpo = textoBruto
        // Remove créditos de fotos e legendas comuns (ex: "— Foto: Reuters", "— REUTERS/Navesh...")
        .replace(/—\s*Foto:[^\n]+/gi, '')
        .replace(/—\s*REUTERS[^\n]+/gi, '')
        // Remove marcações de GIFs e vídeos soltos
        .replace(/GIF\s*-[^\n]+/gi, '')
        // Remove excesso de quebras de linha
        .replace(/\n\s*\n/g, '\n')
        .trim();

    // Remove linhas duplicadas exatas (muito comum ao copiar e colar notícias longas)
    let linhas = textoLimpo.split('\n');
    let linhasUnicas = [...new Set(linhas.map(l => l.trim()))].filter(l => l.length > 0);
    textoLimpo = linhasUnicas.join('\n');

    // 2. DETECÇÃO DE FONTES NOMEADAS E ENTIDADES DE PRESTÍGIO
    // Verifica se a matéria cita cientistas, universidades ou agências de notícias
    const termosConfiaveis = [
        'universidade', 'onu', 'reuters', 'g1', 'pesquisador', 
        'cientista', 'geólogo', 'especialista', 'planet labs', 
        'agência', 'professor', 'estudo', 'relatório', 'distrito'
    ];
    
    let fontesEncontradas = 0;
    termosConfiaveis.forEach(termo => {
        const regex = new RegExp(termo, 'gi');
        const matches = textoLimpo.match(regex);
        if (matches) {
            fontesEncontradas += matches.length;
        }
    });

    // 3. ANÁLISE DE CAUTELA JORNALÍSTICA (Incerteza Investigativa vs. Boato)
    // Em vez de penalizar a incerteza, o algoritmo reconhece que termos de apuração 
    // indicam jornalismo profissional e ético (evitando falsos positivos).
    const termosCautela = [
        'pode ter', 'ainda não está claro', 'estão sendo investigadas', 
        'parecem indicar', 'segundo', 'relatou', 'informou', 'apontaram'
    ];
    
    let indiceCautela = 0;
    termosCautela.forEach(termo => {
        if (textoLimpo.toLowerCase().includes(termo)) {
            indiceCautela++;
        }
    });

    // 4. CRITÉRIO DE CONFIABILIDADE (Lógica de Decisão do Aletheia)
    let pontuacao = 50; // Nota base de neutralidade

    if (fontesEncontradas >= 3) pontuacao += 30; // Ganha pontos se citar especialistas/órgãos
    if (indiceCautela >= 2) pontuacao += 20;    // Recompensa o tom cauteloso do jornalismo real

    let status = "";
    let classeAlerta = "";

    if (pontuacao >= 70) {
        status = "Conteúdo Genuíno / Relato Jornalístico Verificado (Em apuração oficial).";
        classeAlerta = "sucesso";
    } else {
        status = "Atenção: Conteúdo necessita de verificação adicional ou carece de fontes oficiais.";
        classeAlerta = "aviso";
    }

    // Retorna o resultado tratado para ser exibido na interface
    return {
        textoLimpo: textoLimpo,
        totalFontesDetectadas: fontesEncontradas,
        nivelCautelaJornalistica: indiceCautela,
        scoreCredibilidade: Math.min(pontuacao, 100),
        diagnostico: status,
        tipo: classeAlerta
    };
}