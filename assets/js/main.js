// --- 1. Inicializa Ícones ---
lucide.createIcons();

// --- 2. Controle de Tema (Dark / Light) com Cookies ---
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        setCookie('theme', 'light', 365); // Salva por 1 ano
    } else {
        htmlElement.classList.add('dark');
        setCookie('theme', 'dark', 365); // Salva por 1 ano
    }
    // Recalcula para redesenhar o gráfico com as novas cores
    calcular();
});


// --- 3. Lógica da Calculadora ---
const inputs = {
    valorInicial: document.getElementById('valorInicial'),
    aporteMensal: document.getElementById('aporteMensal'),
    taxaJuros: document.getElementById('taxaJuros'),
    tipoTaxa: document.getElementById('tipoTaxa'),
    periodo: document.getElementById('periodo'),
    tipoPeriodo: document.getElementById('tipoPeriodo'),
};

const results = {
    total: document.getElementById('resFinalTotal'),
    investido: document.getElementById('resFinalInvestido'),
    juros: document.getElementById('resFinalJuros'),
};

const ui = {
    chartPlaceholder: document.getElementById('chartPlaceholder'),
    chartContainer: document.getElementById('chartContainer'),
    tableWrapper: document.getElementById('tableContainerWrapper'),
    tableContent: document.getElementById('tableContent'),
    tableBody: document.getElementById('tableBody'),
    btnToggleTable: document.getElementById('btnToggleTable'),
    txtToggleTable: document.getElementById('txtToggleTable'),
    iconToggleTable: document.getElementById('iconToggleTable'),
};

let myChart = null;

const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

function calcular() {
    const vInicial = inputs.valorInicial.value === '' ? 0 : parseFloat(inputs.valorInicial.value);
    const vAporte = inputs.aporteMensal.value === '' ? 0 : parseFloat(inputs.aporteMensal.value);
    const vTaxa = inputs.taxaJuros.value === '' ? 0 : parseFloat(inputs.taxaJuros.value);
    const vPeriodo = inputs.periodo.value === '' ? 0 : parseFloat(inputs.periodo.value);

    if (vPeriodo <= 0) {
        resetUI();
        return;
    }

    let saldoAtual = vInicial;
    let totalInvestido = vInicial;
    const tipoTaxa = inputs.tipoTaxa.value;
    const tipoPeriodo = inputs.tipoPeriodo.value;

    const taxaMensalDecimal = tipoTaxa === 'anual' ? (vTaxa / 100) / 12 : vTaxa / 100;
    const totalMeses = tipoPeriodo === 'anos' ? vPeriodo * 12 : vPeriodo;

    const labels = [];
    const dataTotal = [];
    const dataInvestido = [];
    const dadosTabela = [];

    // Ponto inicial
    labels.push('Início');
    dataTotal.push(vInicial);
    dataInvestido.push(vInicial);

    for (let mes = 1; mes <= totalMeses; mes++) {
        const jurosMes = saldoAtual * taxaMensalDecimal;
        saldoAtual += jurosMes;
        saldoAtual += vAporte;
        totalInvestido += vAporte;

        const deveAdicionarGrafico = totalMeses <= 50 || mes % Math.ceil(totalMeses / 30) === 0 || mes === totalMeses;

        if (deveAdicionarGrafico) {
            let label = "";
            if (tipoPeriodo === 'anos') {
                const anos = mes / 12;
                label = Number.isInteger(anos) ? `${anos} ano(s)` : `${anos.toFixed(1)} ano(s)`;
            } else {
                label = `Mês ${mes}`;
            }
            labels.push(label);
            dataTotal.push(saldoAtual);
            dataInvestido.push(totalInvestido);
        }

        dadosTabela.push({ mes, juros: jurosMes, totalInvestido, totalAcumulado: saldoAtual });
    }

    updateResults(saldoAtual, totalInvestido, saldoAtual - totalInvestido);
    updateChart(labels, dataTotal, dataInvestido);
    renderTable(dadosTabela);
    
    ui.tableWrapper.classList.remove('hidden');
    // Para funcionar com nossa classe semântica que esconde apenas se não tiver o hidden default do tailwind
    ui.chartPlaceholder.style.display = 'none';
    ui.chartContainer.classList.remove('hidden');
}

function updateResults(total, investido, juros) {
    results.total.innerText = formatBRL(total);
    results.investido.innerText = formatBRL(investido);
    results.juros.innerText = formatBRL(juros);
}

function resetUI() {
    results.total.innerText = formatBRL(0);
    results.investido.innerText = formatBRL(0);
    results.juros.innerText = formatBRL(0);
    ui.chartPlaceholder.style.display = 'flex';
    ui.chartContainer.classList.add('hidden');
    ui.tableWrapper.classList.add('hidden');
    if (myChart) { myChart.destroy(); myChart = null; }
}

function updateChart(labels, dataTotal, dataInvestido) {
    const ctx = document.getElementById('investChart').getContext('2d');
    
    // Detecta tema atual para aplicar as cores do Chart.js
    const isDark = document.documentElement.classList.contains('dark');
    
    // Cores dinâmicas
    const colorPrimary = isDark ? '#f8f9fa' : '#111827'; 
    const colorSecondary = isDark ? '#3b82f6' : '#2563eb'; 
    const colorTooltipBg = isDark ? '#2b3035' : '#ffffff';
    const colorTooltipBorder = isDark ? '#343a40' : '#e5e7eb';
    const colorTooltipText = isDark ? '#f8f9fa' : '#111827';
    const colorGrid = isDark ? '#343a40' : '#e5e7eb';
    const colorTicks = isDark ? '#6c757d' : '#6b7280';

    const gradientTotal = ctx.createLinearGradient(0, 0, 0, 400);
    gradientTotal.addColorStop(0, isDark ? 'rgba(248, 249, 250, 0.15)' : 'rgba(17, 24, 39, 0.1)'); 
    gradientTotal.addColorStop(1, isDark ? 'rgba(248, 249, 250, 0)' : 'rgba(17, 24, 39, 0)');

    const gradientInvestido = ctx.createLinearGradient(0, 0, 0, 400);
    gradientInvestido.addColorStop(0, isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.2)');
    gradientInvestido.addColorStop(1, isDark ? 'rgba(59, 130, 246, 0)' : 'rgba(37, 99, 235, 0)');

    if (myChart) {
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = dataInvestido;
        myChart.data.datasets[0].borderColor = colorSecondary;
        myChart.data.datasets[0].backgroundColor = gradientInvestido;
        
        myChart.data.datasets[1].data = dataTotal;
        myChart.data.datasets[1].borderColor = colorPrimary;
        myChart.data.datasets[1].backgroundColor = gradientTotal;
        
        myChart.options.scales.y.grid.color = colorGrid;
        myChart.options.scales.x.ticks.color = colorTicks;
        myChart.options.scales.y.ticks.color = colorTicks;
        myChart.options.plugins.tooltip.backgroundColor = colorTooltipBg;
        myChart.options.plugins.tooltip.titleColor = colorTooltipText;
        myChart.options.plugins.tooltip.bodyColor = colorTooltipText;
        myChart.options.plugins.tooltip.borderColor = colorTooltipBorder;
        
        myChart.update();
    } else {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Investido', data: dataInvestido, borderColor: colorSecondary,
                        backgroundColor: gradientInvestido, borderWidth: 2, fill: true, tension: 0.4,
                        pointRadius: 0, pointHoverRadius: 5, pointHitRadius: 10
                    },
                    {
                        label: 'Total', data: dataTotal, borderColor: colorPrimary,
                        backgroundColor: gradientTotal, borderWidth: 2, fill: true, tension: 0.4,
                        pointRadius: 0, pointHoverRadius: 5, pointHitRadius: 10
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colorTooltipBg, titleColor: colorTooltipText, bodyColor: colorTooltipText,
                        borderColor: colorTooltipBorder, borderWidth: 1, padding: 12, displayColors: true, cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false, drawBorder: false }, ticks: { color: colorTicks, font: { size: 11 } } },
                    y: {
                        grid: { color: colorGrid, borderDash: [5, 5] }, border: { display: false },
                        ticks: { 
                            color: colorTicks, font: { size: 11 },
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', { notation: "compact", compactDisplay: "short" }).format(value);
                            }
                        }
                    }
                }
            }
        });
    }
}

function renderTable(dados) {
    // Usando as novas classes semânticas mapeadas no style.css
    const html = dados.map(d => `
        <tr class="data-tr">
            <td class="data-td td-muted">${d.mes}</td>
            <td class="data-td td-success">+${formatBRL(d.juros)}</td>
            <td class="data-td td-normal-muted">${formatBRL(d.totalInvestido)}</td>
            <td class="data-td td-primary-bold">${formatBRL(d.totalAcumulado)}</td>
        </tr>
    `).join('');
    ui.tableBody.innerHTML = html;
}

let tabelaAberta = false;
ui.btnToggleTable.addEventListener('click', () => {
    tabelaAberta = !tabelaAberta;
    if (tabelaAberta) {
        ui.tableContent.classList.remove('hidden');
        ui.txtToggleTable.innerText = 'Ocultar detalhes';
        ui.iconToggleTable.classList.add('rotate-180');
    } else {
        ui.tableContent.classList.add('hidden');
        ui.txtToggleTable.innerText = 'Ver detalhes';
        ui.iconToggleTable.classList.remove('rotate-180');
    }
});

Object.values(inputs).forEach(el => {
    el.addEventListener('input', calcular);
    el.addEventListener('change', calcular);
});

resetUI();