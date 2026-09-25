// 1. Função para lidar com a colagem da imagem na tela (Opcional)
document.addEventListener('paste', function(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('preview').src = event.target.result;
                document.getElementById('preview').style.display = 'block';
                document.getElementById('placeholder-text').style.display = 'none';
            };
            reader.readAsDataURL(blob);
        }
    }
});

// 2. Função principal que conversa com a IA e burla o CORS
async function iniciarAnaliseReal() {
    const txt = document.getElementById('texto').value;
    const imgElement = document.getElementById('preview');
    const hasImg = imgElement.style.display === 'block';
    
    const terminal = document.getElementById('terminal');
    const resBox = document.getElementById('resultado');
    const btn = document.getElementById('btn-iniciar');
    const pVeredito = document.getElementById('veredito-texto');
    const sImagem = document.getElementById('status-imagem');
    const sNoticia = document.getElementById('status-noticia');

    if(txt.trim().length < 5) {
        alert("Cole o texto da notícia ou o boato para o Oráculo analisar!");
        return;
    }

    // Prepara a interface e mostra o terminal
    resBox.style.display = 'none';
    terminal.style.display = 'block';
    terminal.innerHTML = "";
    btn.disabled = true;
    btn.innerHTML = "PROCESSANDO DADOS VIA API...";

    // Efeito visual do terminal
    const logs = [
        "> [Sistema] Autenticando com a IA e contornando bloqueios (Proxy CORS)...",
        "> [Sistema] Conexão segura estabelecida com o Oráculo.",
        "> [Oráculo] Recebendo dados inseridos pelo usuário...",
        "> [Oráculo] Processando veracidade e gerando veredito. Aguarde..."
    ];

    for (let i = 0; i < logs.length; i++) {
        setTimeout(() => {
            terminal.innerHTML += `<div class="log-linha">${logs[i]}</div>`;
        }, i * 600);
    }

    try {
        // ---------------------------------------------------------
        // COMUNICAÇÃO COM A EASY-PEASY USANDO O PROXY (corsproxy.io)
        // ---------------------------------------------------------
        const response = await fetch("https://corsproxy.io/?https://api.easy-peasy.ai/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "887c2ec7-d5fa-4560-8841-b32f6b9c146a"
            },
            body: JSON.stringify({
                bot: "031173ae-a14a-47cb-bae4-6c2abc411231",
                message: txt
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        // Puxa a resposta da IA
        const respostaIA = data.reply || data.text || data.message || data.content || "Não foi possível extrair o texto da resposta da IA.";

        // Exibe o resultado final
        setTimeout(() => {
            terminal.innerHTML += `<div class="log-linha" style="color: var(--neon-green);">> [Sucesso] Resposta decodificada. Imprimindo relatório...</div>`;
            
            setTimeout(() => {
                terminal.style.display = 'none';
                resBox.style.display = 'block';
                btn.disabled = false;
                btn.innerHTML = "CONSULTAR ORÁCULO ALETHEIA";

                sImagem.innerHTML = hasImg ? "<span class='status-true'>\"anexada\"</span>" : "<span style='color: #94a3b8;'>\"não enviada\"</span>";
                sNoticia.innerHTML = "<span class='status-true'>\"verificada pela IA\"</span>";

                pVeredito.innerHTML = respostaIA.replace(/\n/g, '<br>'); 
                resBox.scrollIntoView({ behavior: 'smooth' });
            }, 1000);

        }, 2500); 

    } catch (error) {
        setTimeout(() => {
            terminal.innerHTML += `<div class="log-linha" style="color: #ff4444;">> [ERRO CRÍTICO] Falha ao comunicar com a API: ${error.message}</div>`;
            btn.disabled = false;
            btn.innerHTML = "TENTAR NOVAMENTE";
        }, 2500);
    }
}