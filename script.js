document.addEventListener('DOMContentLoaded', () => {
    // ... (restante do seu código de seleção de elementos permanece o mesmo) ...
    const servicesContainer = document.getElementById('services-container');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const calcularMrrBtn = document.getElementById('calcularMrrBtn');

    const quantidadeBoletosInput = document.getElementById('quantidadeBoletos');

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

    // ... (função addServiceRow() permanece a mesma) ...
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
        let hasValidServiceInput = false;

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

        const quantidadeBoletos = parseFloat(quantidadeBoletosInput.value.replace(',', '.'));
        const valorBoletos = isNaN(quantidadeBoletos) || quantidadeBoletos < 0 ? 0 : quantidadeBoletos * 1.50;
        totalMrrMensal += valorBoletos;
        
        if (!hasValidServiceInput && valorBoletos === 0) {
            alert('Por favor, insira pelo menos um valor válido para um serviço ou para a quantidade de boletos.');
            mrrResultDiv.style.display = 'none';
            resultsSection.style.display = 'none';
            return;
        }

        mrrMensalDisplay.textContent = `R$ ${totalMrrMensal.toFixed(2).replace('.', ',')}`;
        mrrResultDiv.style.display = 'block';
        mrrBaseDisplay.textContent = `R$ ${totalMrrMensal.toFixed(2).replace('.', ',')}`;

        // --- CÁLCULO CORRIGIDO para Gestão Integrada ---
        let valorOfertaGI;
        // A base para o cálculo do piso é o MRR Total
        const mrrBaseParaPisoGI = totalMrrMensal; 

        if (mrrBaseParaPisoGI <= 199.00) {
            valorOfertaGI = 199.00;
        } else {
            valorOfertaGI = mrrBaseParaPisoGI + 50.00;
        }
        // O ganho real é a diferença entre o novo valor ofertado e o MRR Total ATUAL
        const ganhoRealGI = valorOfertaGI - totalMrrMensal; 
        const ganhoPercentualGI = (ganhoRealGI / totalMrrMensal) * 100;

        valorOfertarGestao.textContent = `R$ ${valorOfertaGI.toFixed(2).replace('.', ',')}`;
        ganhoRealGestao.textContent = `R$ ${ganhoRealGI.toFixed(2).replace('.', ',')}`;
        ganhoPercentualGestao.textContent = `${ganhoPercentualGI.toFixed(2).replace('.', ',')}%`;

        // --- CÁLCULO CORRIGIDO para Ilimitado 2024 ---
        let valorOfertaILIMITADO;
        // A base para o cálculo do piso é o MRR Total
        const mrrBaseParaPisoILIMITADO = totalMrrMensal; 

        if (mrrBaseParaPisoILIMITADO <= 560.00) {
            valorOfertaILIMITADO = 560.00;
        } else {
            valorOfertaILIMITADO = mrrBaseParaPisoILIMITADO + 200.00;
        }
        // O ganho real é a diferença entre o novo valor ofertado e o MRR Total ATUAL
        const ganhoRealILIMITADO = valorOfertaILIMITADO - totalMrrMensal; 
        const ganhoPercentualILIMITADO = (ganhoRealILIMITADO / totalMrrMensal) * 100;

        valorOfertarIlimitado.textContent = `R$ ${valorOfertaILIMITADO.toFixed(2).replace('.', ',')}`;
        ganhoRealIlimitado.textContent = `R$ ${ganhoRealILIMITADO.toFixed(2).replace('.', ',')}`;
        ganhoPercentualIlimitado.textContent = `${ganhoPercentualILIMITADO.toFixed(2).replace('.', ',')}%`;

        resultsSection.style.display = 'block';
    });
});
