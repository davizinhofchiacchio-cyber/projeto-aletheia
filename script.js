/**
 * Motor de Análise CacauV1.1 - Projeto Aletheia
 * (Versão V6 - Separação de Imprensa Oficial vs. Boatos/Acusações Informais)
 */
function analisarNoticiaAletheia(textoBruto, temImagem = false, temVideo = false) {
    if (!textoBruto) textoBruto = "";
    
    let textoLimpo = textoBruto
        .replace(/—\s*Foto:[^\n]+/gi, '')
        .replace(/—\s*REUTERS[^\n]+/gi, '')
        .replace(/GIF\s*-[^\n]+/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

    // Normaliza o texto: remove acentos e transforma em minúsculas
    let textoBusca = textoLimpo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. FONTES E VEÍCULOS DE IMPRENSA OFICIAIS (Dão credibilidade real)
    const imprensaEOficiais = [
        'g1', 'reuters', 'cnn', 'sbt', 'bbc', 'folha', 'estadao', 'uol', 'globo', 'nature', 'science',
        'onu', 'governo', 'ministerio', 'defesa civil', 'policia', 'delegacia', 'boletim de ocorrencia', 
        'prefeitura', 'tribunal', 'justica', 'agencia oficial', 'universidade', 'stanford', 'harvard', 'mit', 'usp'
    ];
    let fontesOficiaisCount = 0;
    imprensaEOficiais.forEach(function(termo) {
        if (textoBusca.includes(termo)) fontesOficiaisCount++;
    });

    // 2. CONTEXTO LOCAL E CARGOS (Apenas contextualizam o texto, não garantem veracidade sozinhos)
    const contextoLocal = ['escola', 'professora', 'professor', 'diretora', 'diretor', 'coordenadora', 'coordena', 'aluno', 'alunos', 'empresa'];
    let contextoLocalCount = 0;
    contextoLocal.forEach(function(termo) {
        if (textoBusca.includes(termo)) contextoLocalCount++;
    });

    // 3. TERMOS DE LINGUAGEM CIENTÍFICA E CAUTELA
    const termosCautela = [
        'pode ser', 'pode ter', 'futuramente', 'ainda nao', 'estao sendo', 
        'segundo', 'permite', 'permitiu', 'indica', 'possivel', 'pela primeira vez', 'estimativa', 'de acordo'
    ];
    let indiceCautela = 0;
    termosCautela.forEach(function(termo) {
        if (textoBusca.includes(termo)) indiceCautela++;
    });

    // 4. GATILHOS DE SENSACIONALISMO E ALERTA
    const termosAlerta = [
        'repassem', 'espalhem', 'a midia esconde', 'nao querem que voce saiba', 
        'compartilhe', 'cura milagrosa', 'urgente', 'atencao', '!!!'
    ];
    let indiceAlerta = 0;
    termosAlerta.forEach(function(termo) {
        if (textoBusca.includes(termo)) indiceAlerta++;
    });

    // 5. GATILHOS DE ACUSAÇÃO INFORMAL E BOATO (Sem respaldo de órgão oficial)
    const termosAcusacaoInformal = [
        'e pega', 'esta sendo pega', 'pega vendendo', 'envolvida no caso', 'envolvidas no caso',
        'esquema', 'roubando', 'preso em flagrante', 'flagrado'
    ];
    let indiceAcusacaoInformal = 0;
    termosAcusacaoInformal.forEach(function(termo) {
        if (textoBusca.includes(termo)) indiceAcusacaoInformal++;
    });

    // 6. ABSURDOS E PSEUDO-SAÚDE
    const termosAbsurdos = ['cama elastica', 'pula-pula', 'toboga aquatico', 'unicornio', 'shake', 'alibaba'];
    let indiceAbsurdo = 0;
    termosAbsurdos.forEach(function(termo) {
        if (textoBusca.includes(termo)) indiceAbsurdo++;
    });

    const termosPseudoSaude = ['elimina completamente', 'previne 100%', 'cura 100%', 'agua com sal', 'em jejum'];
    let indicePseudoSaude = 0;
    termosPseudoSaude.forEach(function(termo) {
        if (textoBusca.includes(termo)) indicePseudoSaude++;
    });

    // 7. CHECAGEM DE CAIXA ALTA
    const palavrasMaiusculas = textoBruto.match(/[A-Z]{3,}/g) || [];
    const excessoCaixaAlta = palavrasMaiusculas.length > 2;

    // --- CÁLCULO DE PONTUAÇÃO ---
    let pontuacao = 50; 

    // Bônus por fonte institucional/imprensa real
    if (fontesOficiaisCount >= 1) pontuacao += 25; 
    if (fontesOficiaisCount >= 3) pontuacao += 15; 
    
    // Pequeno bônus por contexto bem delimitado (apenas se houver linguagem neutra)
    if (contextoLocalCount >= 2 && indiceAlerta === 0) pontuacao += 10;
    if (indiceCautela >= 1) pontuacao += 10;

    // --- PENALIDADES ---
    if (indiceAlerta >= 1) pontuacao -= 25; 
    if (excessoCaixaAlta) pontuacao -= 20; 
    if (temImagem || temVideo) pontuacao -= 10;
    
    // Penalidade por acusação informal sem fonte oficial citada
    if (indiceAcusacaoInformal >= 1 && fontesOficiaisCount === 0) {
        pontuacao -= 40; 
    }

    // Punições Absolutas
    if (indiceAbsurdo >= 1) pontuacao -= 80; 
    if (indicePseudoSaude >= 1) pontuacao -= 80; 

    // Trava o limite entre 0 e 100
    pontuacao = Math.min(Math.max(pontuacao, 0), 100);

    // --- GERAÇÃO DO DIAGNÓSTICO ---
    let status = "";
    let classeAlerta = "";

    if (pontuacao >= 55) {
        status = `<b>Análise Concluída:</b> O Orquestrador identificou fontes oficiais de imprensa/institucionais compatíveis com relatórios verificáveis. Conteúdo validado como autêntico.`;
        classeAlerta = "sucesso";
    } else {
        let motivos = [];
        if (indiceAcusacaoInformal >= 1 && fontesOficiaisCount === 0) motivos.push("Contém acusações informais ou relatos de irregularidade sem citação de órgãos oficiais (Polícia, Justiça) ou veículos de imprensa.");
        if (indicePseudoSaude >= 1) motivos.push("Uso de alegações médicas suspeitas ou promessas absolutas de saúde.");
        if (indiceAbsurdo >= 1) motivos.push("Menção a entidades fictícias ou cenários absurdos.");
        if (indiceAlerta >= 1 || excessoCaixaAlta) motivos.push("Uso de gatilhos de urgência (URGENTE/!!!) ou caixa alta excessiva.");
        if (fontesOficiaisCount === 0 && indiceAcusacaoInformal === 0) motivos.push("Ausência de fontes institucionais ou jornalísticas verificáveis.");

        status = `<b>ALERTA DE FRAUDE / BOATO:</b> O Orquestrador detectou probabilidade de desinformação ou relato não verificado.<br><br><b>Padrões detectados:</b><ul><li>${motivos.join("</li><li>")}</li></ul>`;
        classeAlerta = "perigo";
    }

    return {
        textoLimpo: textoLimpo,
        scoreCredibilidade: pontuacao,
        diagnostico: status,
        tipo: classeAlerta
    };
}