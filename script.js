document.addEventListener('DOMContentLoaded', () => {
    // Seleção dos elementos HTML (existentes)
    const servicesContainer = document.getElementById('services-container');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const calcularMrrBtn = document.getElementById('calcularMrrBtn');

    // NOVOS ELEMENTOS: Botões de Rádio e Contêineres de Grupos
    const integratedAccountRadios = document.querySelectorAll('input[name="integratedAccount"]'); // Seleciona ambos os rádios
    const boletosGroup = document.getElementById('boletos-group');
    const faturasGroup = document.getElementById('faturas-group');

    // Elementos de input (existentes, mas agora podem estar em grupos escondidos)
    const quantidadeBoletosInput = document.getElementById('quantidadeBoletos');
    const fatura1Input = document.getElementById('fatura1');
    const fatura2Input = document.getElementById('fatura2');
    const fatura3Input = document.getElementById('fatura3');

    const mrrResultDiv = document.querySelector('.mrr-result');
    const mrrMensalDisplay = document.getElementById('mrrMensalDisplay');
    
    const resultsSection = document.querySelector('.results-section');
    const mrrBaseDisplay = document.getElementById('mrrBaseDisplay');

    const valorOfertarGestao = document.getElementById('valorOfertarGestao');
    const ganhoRealGestao = document.getElementById('ganhoRealGestao');
    const ganhoPercentualGestao = document.getElementById('ganhoPercentualGestao');

    const valorOfertarIlimitado = document.getElementById('valorOfertarIlimitado');
    const ganhoRealIlimitado = document.getElementById('ganhoRealIlimitado');
    const ganhoPercentualIlimitado = document.getElementById('ganhoPercentualIlimitado');

    // Função para adicionar uma nova linha de serviço (mantém a mesma)
    function addServiceRow() {
        const serviceItem = document.createElement('div');
        serviceItem.classList.add('service-item');
        serviceItem.innerHTML = `
            <div class="form-group">
                <label>Serviço:</label>
                <select class="servico-select">
                    <option value="plano">Plano</option>
                    <option value="aplicativo">Aplicativo</option>
                    <option value="outro">Outro Serviço</option>
                </select>
            </div>
            <div class="form-group">
                <label>Periodicidade:</label>
                <select class="periodicidade-select">
                    <option value="1">Mensal</option>
                    <option value="3">Trimestral</option>
                    <option value="6">Semestral</option>
                    <option value="12">Anual</option>
                </select>
            </div>
            <div class="form-group">
                <label>Valor Atual (R$):</label>
                <input type="number" class="valorAtual-input" placeholder="Ex: 600.00" step="0.01">
            </div>
            <button class="remove-service-btn secondary-btn">Remover Serviço</button>
        `;
        servicesContainer.appendChild(serviceItem);

        serviceItem.querySelector('.remove-service-btn').addEventListener('click', (event) => {
            event.target.closest('.service-item').remove();
            calcularMrrBtn.click();
        });
    }

    if (servicesContainer.children.length === 0) {
        addServiceRow();
    } else {
        document.querySelectorAll('.remove-service-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.target.closest('.service-item').remove();
                calcularMrrBtn.click();
            });
        });
    }

    addServiceBtn.addEventListener('click', addServiceRow);

    // Função para controlar a visibilidade dos grupos de boletos/faturas e limpar campos
    function toggleInputGroups() {
        const selectedOption = document.querySelector('input[name="integratedAccount"]:checked').value;

        if (selectedOption === 'yes') {
            // Cliente tem conta integrada: mostrar faturas, esconder boletos
            faturasGroup.style.display = 'block';
            boletosGroup.style.display = 'none';
            // Limpar valor dos boletos para não afetar o cálculo
            quantidadeBoletosInput.value = '0'; 
        } else { // selectedOption === 'no'
            // Cliente NÃO tem conta integrada: mostrar boletos, esconder faturas
            faturasGroup.style.display = 'none';
            boletosGroup.style.display = 'block';
            // Limpar valores das faturas para não afetar o cálculo
            fatura1Input.value = '0';
            fatura2Input.value = '0';
            fatura3Input.value = '0';
        }
        // Disparar o cálculo novamente para atualizar o MRR com base nos campos visíveis/limpos
        calcularMrrBtn.click();
    }

    // Adiciona listener aos botões de rádio
    integratedAccountRadios.forEach(radio => {
        radio.addEventListener('change', toggleInputGroups);
    });

    // Chama a função uma vez ao carregar a página para definir o estado inicial
    toggleInputGroups(); 

    // Função auxiliar para formatar como moeda BRL (já existente)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    calcularMrrBtn.addEventListener('click', () => {
        let totalMrrMensal = 0;
        let hasValidInput = false;

        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => {
            const valorAtualInput = item.querySelector('.valorAtual-input');
            const periodicidadeSelect = item.querySelector('.periodicidade-select');

            const valorAtual = parseFloat(valorAtualInput.value.replace(',', '.'));
            const periodicidade = parseInt(periodicidadeSelect.value);

            if (!isNaN(valorAtual) && valorAtual > 0) {
                totalMrrMensal += (valorAtual / periodicidade);
                hasValidInput = true;
            }
        });

        // CÁLCULO DE BOLETOS (APENAS SE O GRUPO ESTIVER VISÍVEL)
        if (boletosGroup.style.display === 'block') { // Verifica se o grupo está visível
            const quantidadeBoletos = parseFloat(quantidadeBoletosInput.value.replace(',', '.'));
            const valorBoletos = isNaN(quantidadeBoletos) || quantidadeBoletos < 0 ? 0 : quantidadeBoletos * 1.50;
            totalMrrMensal += valorBoletos;
            if (valorBoletos > 0) {
                hasValidInput = true;
            }
        }

        // CÁLCULO DE FATURAS (APENAS SE O GRUPO ESTIVER VISÍVEL)
        if (faturasGroup.style.display === 'block') { // Verifica se o grupo está visível
            const fatura1 = parseFloat(fatura1Input.value.replace(',', '.'));
            const fatura2 = parseFloat(fatura2Input.value.replace(',', '.'));
            const fatura3 = parseFloat(fatura3Input.value.replace(',', '.'));

            let somaFaturas = 0;
            let numFaturasValidas = 0;

            if (!isNaN(fatura1) && fatura1 > 0) {
                somaFaturas += fatura1;
                numFaturasValidas++;
            }
            if (!isNaN(fatura2) && fatura2 > 0) {
                somaFaturas += fatura2;
                numFaturasValidas++;
            }
            if (!isNaN(fatura3) && fatura3 > 0) {
                somaFaturas += fatura3;
                numFaturasValidas++;
            }

            let mediaFaturas = 0;
            if (numFaturasValidas > 0) {
                mediaFaturas = somaFaturas / numFaturasValidas;
                hasValidInput = true;
            }
            
            totalMrrMensal += mediaFaturas;
        }

        if (!hasValidInput) {
            alert('Por favor, insira pelo menos um valor válido para um serviço, quantidade de boletos ou faturas.');
            mrrResultDiv.style.display = 'none';
            resultsSection.style.display = 'none';
            return;
        }

        mrrMensalDisplay.textContent = formatCurrency(totalMrrMensal);
        mrrResultDiv.style.display = 'block';
        mrrBaseDisplay.textContent = formatCurrency(totalMrrMensal);

        // --- CÁLCULO para Gestão Integrada ---
        let valorOfertaGI;
        const mrrBaseParaPisoGI = totalMrrMensal; 

        if (mrrBaseParaPisoGI <= 199.00) {
            valorOfertaGI = 199.00;
        } else {
            valorOfertaGI = mrrBaseParaPisoGI + 50.00;
        }
        const ganhoRealGI = valorOfertaGI - totalMrrMensal; 
        const ganhoPercentualGI = (ganhoRealGI / totalMrrMensal) * 100;

        valorOfertarGestao.textContent = formatCurrency(valorOfertaGI);
        ganhoRealGestao.textContent = formatCurrency(ganhoRealGI);
        ganhoPercentualGestao.textContent = `${ganhoPercentualGI.toFixed(2).replace('.', ',')}%`;

        // --- CÁLCULO para Ilimitado 2024 ---
        let valorOfertaILIMITADO;
        const mrrBaseParaPisoILIMITADO = totalMrrMensal; 

        if (mrrBaseParaPisoILIMITADO <= 560.00) {
            valorOfertaILIMITADO = 560.00;
        } else {
            valorOfertaILIMITADO = mrrBaseParaPisoILIMITADO + 200.00;
        }
        const ganhoRealILIMITADO = valorOfertaILIMITADO - totalMrrMensal; 
        const ganhoPercentualILIMITADO = (ganhoRealILIMITADO / totalMrrMensal) * 100;

        valorOfertarIlimitado.textContent = formatCurrency(valorOfertaILIMITADO);
        ganhoRealIlimitado.textContent = formatCurrency(ganhoRealILIMITADO);
        ganhoPercentualIlimitado.textContent = `${ganhoPercentualILIMITADO.toFixed(2).replace('.', ',')}%`;

        resultsSection.style.display = 'block';
    });
});
