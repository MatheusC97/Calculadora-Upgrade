document.addEventListener('DOMContentLoaded', () => {
    // Seleção dos elementos HTML
    const servicesContainer = document.getElementById('services-container');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const calcularMrrBtn = document.getElementById('calcularMrrBtn');

    // Novo elemento para Quantidade de Boletos
    const quantidadeBoletosInput = document.getElementById('quantidadeBoletos');

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

    // Função para adicionar uma nova linha de serviço
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

        // Adiciona evento para o botão de remover serviço recém-criado
        serviceItem.querySelector('.remove-service-btn').addEventListener('click', (event) => {
            event.target.closest('.service-item').remove();
            // Recalcula se houver valores já preenchidos para refletir a remoção
            calcularMrrBtn.click(); // Dispara o cálculo novamente
        });
    }

    // Adiciona um serviço inicial se a página carregar sem nenhum
    if (servicesContainer.children.length === 0) {
        addServiceRow();
    } else {
        // Se já existir, garante que o botão de remover está configurado
        document.querySelectorAll('.remove-service-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.target.closest('.service-item').remove();
                calcularMrrBtn.click(); // Dispara o cálculo novamente
            });
        });
    }

    // Listener para o botão "Adicionar Outro Serviço"
    addServiceBtn.addEventListener('click', addServiceRow);

    // Listener para o botão "Calcular MRR Mensal"
    calcularMrrBtn.addEventListener('click', () => {
        let totalMrrMensal = 0;
        let hasValidServiceInput = false; // Flag para verificar se há pelo menos um serviço válido

        // Seleciona todos os grupos de serviço
        const serviceItems = document.querySelectorAll('.service-item');

        serviceItems.forEach(item => {
            const valorAtualInput = item.querySelector('.valorAtual-input');
            const periodicidadeSelect = item.querySelector('.periodicidade-select');

            const valorAtual = parseFloat(valorAtualInput.value.replace(',', '.'));
            const periodicidade = parseInt(periodicidadeSelect.value);

            if (!isNaN(valorAtual) && valorAtual > 0) {
                totalMrrMensal += (valorAtual / periodicidade);
                hasValidServiceInput = true;
            }
        });

        // NOVO CÁLCULO: Quantidade de Boletos
        const quantidadeBoletos = parseFloat(quantidadeBoletosInput.value.replace(',', '.'));
        const valorBoletos = isNaN(quantidadeBoletos) || quantidadeBoletos < 0 ? 0 : quantidadeBoletos * 1.50;
        totalMrrMensal += valorBoletos; // Adiciona o valor dos boletos ao MRR total
        
        // Se não houver serviços válidos e nem boletos válidos
        if (!hasValidServiceInput && valorBoletos === 0) {
            alert('Por favor, insira pelo menos um valor válido para um serviço ou para a quantidade de boletos.');
            mrrResultDiv.style.display = 'none';
            resultsSection.style.display = 'none';
            return;
        }


        // Exibe o MRR Mensal Total
        mrrMensalDisplay.textContent = `R$ ${totalMrrMensal.toFixed(2).replace('.', ',')}`;
        mrrResultDiv.style.display = 'block';
        mrrBaseDisplay.textContent = `R$ ${totalMrrMensal.toFixed(2).replace('.', ',')}`;

        // --- Cálculo para Gestão Integrada ---
        let valorOfertaGI;
        if (totalMrrMensal <= 199.00) {
            valorOfertaGI = 199.00;
        } else {
            valorOfertaGI = totalMrrMensal + 50.00;
        }
        const ganhoRealGI = valorOfertaGI - totalMrrMensal;
        const ganhoPercentualGI = (ganhoRealGI / totalMrrMensal) * 100;

        valorOfertarGestao.textContent = `R$ ${valorOfertaGI.toFixed(2).replace('.', ',')}`;
        ganhoRealGestao.textContent = `R$ ${ganhoRealGI.toFixed(2).replace('.', ',')}`;
        ganhoPercentualGestao.textContent = `${ganhoPercentualGI.toFixed(2).replace('.', ',')}%`;

        // --- Cálculo para Ilimitado 2024 ---
        let valorOfertaILIMITADO;
        if (totalMrrMensal <= 560.00) {
            valorOfertaILIMITADO = 560.00;
        } else {
            valorOfertaILIMITADO = totalMrrMensal + 200.00;
        }
        const ganhoRealILIMITADO = valorOfertaILIMITADO - totalMrrMensal;
        const ganhoPercentualILIMITADO = (ganhoRealILIMITADO / totalMrrMensal) * 100;

        valorOfertarIlimitado.textContent = `R$ ${valorOfertaILIMITADO.toFixed(2).replace('.', ',')}`;
        ganhoRealIlimitado.textContent = `R$ ${ganhoRealILIMITADO.toFixed(2).replace('.', ',')}`;
        ganhoPercentualIlimitado.textContent = `${ganhoPercentualILIMITADO.toFixed(2).replace('.', ',')}%`;

        resultsSection.style.display = 'block';
    });
});
