document.addEventListener('DOMContentLoaded', () => {
    // Seleção dos elementos HTML
    const servicesContainer = document.getElementById('services-container');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const calcularMrrBtn = document.getElementById('calcularMrrBtn');

    const quantidadeBoletosInput = document.getElementById('quantidadeBoletos');

    // NOVOS ELEMENTOS: Faturas
    const fatura1Input = document.getElementById('fatura1');
    const fatura2Input = document.getElementById('fatura2');
    const fatura3Input = document.getElementById('fatura3');

    const mrrResultDiv = document.querySelector('.mrr-result');
    const mrrMensalDisplay = document.getElementById('mrrMensalDisplay');
    
    const resultsSection = document.querySelector('.results-section');
    const mrrBaseDisplay = document.getElementById('mrrBaseDisplay');

    // Elementos para o upgrade Gestão Integrada
    const valorOfertarGestao = document.getElementById('valorOfertarGestao');
    const ganhoRealGestao = document.getElementById('ganhoRealGestao');
    const ganhoPercentualGestao = document.getElementById('ganhoPercentualGestao');

    // Elementos para o upgrade Ilimitado 2024
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

    calcularMrrBtn.addEventListener('click', () => {
        let totalMrrMensal = 0;
        let hasValidInput = false; // Esta flag agora considera serviços, boletos e faturas

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

        const quantidadeBoletos = parseFloat(quantidadeBoletosInput.value.replace(',', '.'));
        const valorBoletos = isNaN(quantidadeBoletos) || quantidadeBoletos < 0 ? 0 : quantidadeBoletos * 1.50;
        totalMrrMensal += valorBoletos;
        if (valorBoletos > 0) { // Verifica se há valor de boletos para considerar input válido
            hasValidInput = true;
        }

        // NOVO CÁLCULO: Faturas
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
            hasValidInput = true; // Se há faturas válidas, o input é válido
        }
        
        totalMrrMensal += mediaFaturas; // Adiciona a média das faturas ao MRR total

        // Validação geral final
        if (!hasValidInput) {
            alert('Por favor, insira pelo menos um valor válido para um serviço, quantidade de boletos ou faturas.');
            mrrResultDiv.style.display = 'none';
            resultsSection.style.display = 'none';
            return;
        }

        // Formatação para BRL (reutilizando a função auxiliar)
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        };

        mrrMensalDisplay.textContent = formatCurrency(totalMrrMensal);
        mrrResultDiv.style.display = 'block';
        mrrBaseDisplay.textContent = formatCurrency(totalMrrMensal);

        // --- CÁLCULO CORRIGIDO para Gestão Integrada ---
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

        // --- CÁLCULO CORRIGIDO para Ilimitado 2024 ---
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
