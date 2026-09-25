// 1. Função para lidar com a colagem da imagem no ecrã (Opcional)
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

// 2. Função principal com comunicação direta à API do Bot
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

    resBox.style.display = 'none';
    terminal.style.display = 'block';
    terminal.innerHTML = "";
    btn.disabled = true;
    btn.innerHTML = "PROCESSANDO DADOS VIA API...";

    const logs = [
        "> [Sistema] A iniciar comunicação direta com a IA...",
        "> [Sistema] Conexão segura estabelecida com o Oráculo.",
        "> [Oráculo] A receber os dados inseridos...",
        "> [Oráculo] A processar a veracidade. Aguarde..."
    ];

    for (let i = 0; i < logs.length; i++) {
        setTimeout(() => {
            terminal.innerHTML += `<div class="log-linha">${logs[i]}</div>`;
        }, i * 600);
    }

    try {
        // Conexão DIRETA sem proxies (usando as credenciais que autorizaste)
        const urlDoBot = "https://bots.easy-peasy.ai/bot/031173ae-a14a-47cb-bae4-6c2abc411231/api";

        const response = await fetch(urlDoBot, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "887c2ec7-d5fa-4560-8841-b32f6b9c146a"
            },
            body: JSON.stringify({
                message: txt
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        const respostaIA = data.bot_response || data.bot?.text || data.reply || data.text || data.message || "Análise executada mas resposta em formato desconhecido.";

        setTimeout(() => {
            terminal.innerHTML += `<div class="log-linha" style="color: var(--neon-green);">> [Sucesso] Resposta descodificada. A imprimir relatório...</div>`;
            
            setTimeout(() => {
                terminal.style.display = 'none';
                resBox.style.display = 'block';
                btn.disabled = false;
                btn.innerHTML = "CONSULTAR ORÁCULO ALETHEIA";

                if (sImagem) sImagem.innerHTML = hasImg ? "<span class='status-true'>\"anexada\"</span>" : "<span style='color: #94a3b8;'>\"não enviada\"</span>";
                if (sNoticia) sNoticia.innerHTML = "<span class='status-true'>\"verificada pela IA\"</span>";

                if (pVeredito) pVeredito.innerHTML = respostaIA.replace(/\n/g, '<br>'); 
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