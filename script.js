// Variáveis para controle
        let curseCounter = 5;
        let equipmentCounter = 0;
        let currentPath = null;
        const desperationEffects = {
    6: "Falha na ação e atrapalha aliados",
    8: "Quebra o item que está sendo segurado",
    10: "Tremer de desespero (-2 na próxima ação)",
    12: "Fuga em desespero (+2d6 de dano psiquê)",
    14: "Condição 'Aterrorizado'",
    15: "+1 de Insanidade e paralisa em desespero"
};
let isBloodMoonTheme = false;
        
        // Funções para ajustar valores de status
        function adjustHP(value) {
            const currentHP = document.getElementById('current-hp');
            const maxHP = document.getElementById('max-hp');
            const hpFill = document.getElementById('hp-fill');
            
            let newValue = parseInt(currentHP.textContent) + value;
            let maxValue = parseInt(maxHP.textContent);
            
            // Ajustar máximo se necessário
            if (newValue > maxValue) {
                maxValue = newValue;
                maxHP.textContent = maxValue;
            }
            
            if (newValue < 0) newValue = 0;
            
            currentHP.textContent = newValue;
            hpFill.style.width = (newValue / maxValue * 100) + '%';
        }
        
        function adjustPA(value) {
            const currentPA = document.getElementById('current-pa');
            const maxPA = document.getElementById('max-pa');
            const paFill = document.getElementById('pa-fill');
            
            let newValue = parseInt(currentPA.textContent) + value;
            let maxValue = parseInt(maxPA.textContent);
            
            // Ajustar máximo se necessário
            if (newValue > maxValue) {
                maxValue = newValue;
                maxPA.textContent = maxValue;
            }
            
            if (newValue < 0) newValue = 0;
            
            currentPA.textContent = newValue;
            paFill.style.width = (newValue / maxValue * 100) + '%';
        }
        
        function adjustPsy(value) {
            const currentPsy = document.getElementById('current-psy');
            const maxPsy = document.getElementById('max-psy');
            const psyFill = document.getElementById('psy-fill');
            
            let newValue = parseInt(currentPsy.textContent) + value;
            let maxValue = parseInt(maxPsy.textContent);
            
            // Ajustar máximo se necessário
            if (newValue > maxValue) {
                maxValue = newValue;
                maxPsy.textContent = maxValue;
            }
            
            if (newValue < 0) newValue = 0;
            
            currentPsy.textContent = newValue;
            psyFill.style.width = (newValue / maxValue * 100) + '%';
        }
        
        // Funções para modais
        function openCurseModal() {
            document.getElementById('curse-modal').style.display = 'block';
        }
        
        function openEquipmentModal() {
            document.getElementById('equipment-modal').style.display = 'block';
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }
        
        // Função para adicionar nova maldição
        function addNewCurse() {
    const name = document.getElementById('curse-name').value;
    const cost = document.getElementById('curse-cost').value;
    const element = document.getElementById('curse-element').value;
    const description = document.getElementById('curse-description').value;
    
    if (!name || !description) {
        alert('Por favor, preencha pelo menos o nome e a descrição da maldição.');
        return;
    }
    
    curseCounter++;
    const newCurseId = 'curse-' + curseCounter;
    
    const newCurseHTML = `
        <div class="curse-card" id="${newCurseId}">
            <div class="curse-cost"><span class="editable" contenteditable="true">${cost}</span> PA</div>
            <div class="curse-name editable" contenteditable="true">${name}</div>
            ${element ? `<p><strong>Elemento:</strong> ${element}</p>` : ''}
            <p class="editable" contenteditable="true">${description}</p>
            <button class="delete-btn" onclick="deleteCurse('${newCurseId}')">Remover</button>
        </div>
    `;
    
    document.getElementById('curses-list').insertAdjacentHTML('beforeend', newCurseHTML);
    
    // Limpar formulário
    document.getElementById('curse-name').value = '';
    document.getElementById('curse-cost').value = '1';
    document.getElementById('curse-element').value = '';
    document.getElementById('curse-description').value = '';
    
    closeModal('curse-modal');
}
        
        // Função para adicionar novo equipamento
        function addNewEquipment() {
            const name = document.getElementById('equipment-name').value;
            const damage = document.getElementById('equipment-damage').value;
            
            if (!name) {
                alert('Por favor, preencha pelo menos o nome do equipamento.');
                return;
            }
            
            equipmentCounter++;
            const equipmentList = document.getElementById('equipment-list');
            
            // Remover mensagem padrão se for o primeiro equipamento
            if (equipmentCounter === 1) {
                equipmentList.innerHTML = '';
            }
            
            const newEquipmentHTML = `
                <div class="inventory-item" id="equipment-${equipmentCounter}">
                    <span class="editable" contenteditable="true">${name}</span>
                    <span class="editable" contenteditable="true">${damage || '-'}</span>
                    <button class="delete-btn" onclick="deleteEquipment('equipment-${equipmentCounter}')">Remover</button>
                </div>
            `;
            
            equipmentList.insertAdjacentHTML('beforeend', newEquipmentHTML);
            
            // Limpar formulário
            document.getElementById('equipment-name').value = '';
            document.getElementById('equipment-damage').value = '';
            
            closeModal('equipment-modal');
        }
        
        // Funções para remover itens
        function deleteCurse(curseId) {
            if (confirm('Tem certeza que deseja remover esta maldição?')) {
                document.getElementById(curseId).remove();
            }
        }
        
        function deleteEquipment(equipmentId) {
            if (confirm('Tem certeza que deseja remover este equipamento?')) {
                document.getElementById(equipmentId).remove();
                
                // Verificar se não há mais equipamentos e adicionar mensagem padrão
                const equipmentList = document.getElementById('equipment-list');
                if (equipmentList.children.length === 0) {
                    equipmentList.innerHTML = '<p>Nenhum equipamento adicionado ainda.</p>';
                    equipmentCounter = 0;
                }
            }
        }
        
        // Fechar modais ao clicar fora deles
        window.onclick = function(event) {
            if (event.target.className === 'modal') {
                event.target.style.display = 'none';
            }
        }
        
        // Atualizar barras quando valores máximos são editados
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('max-hp').addEventListener('input', updateHPBar);
            document.getElementById('max-pa').addEventListener('input', updatePABar);
            document.getElementById('max-psy').addEventListener('input', updatePsyBar);
        });
        
        function updateHPBar() {
            const current = parseInt(document.getElementById('current-hp').textContent);
            const max = parseInt(document.getElementById('max-hp').textContent) || 1;
            document.getElementById('hp-fill').style.width = (Math.min(current, max) / max * 100) + '%';
        }
        
        function updatePABar() {
            const current = parseInt(document.getElementById('current-pa').textContent);
            const max = parseInt(document.getElementById('max-pa').textContent) || 1;
            document.getElementById('pa-fill').style.width = (Math.min(current, max) / max * 100) + '%';
        }
        
        function updatePsyBar() {
            const current = parseInt(document.getElementById('current-psy').textContent);
            const max = parseInt(document.getElementById('max-psy').textContent) || 1;
            document.getElementById('psy-fill').style.width = (Math.min(current, max) / max * 100) + '%';

        
        }
// Funções para controle de edição
       function enableEditing() {
    const editables = document.querySelectorAll('[contenteditable]');
    editables.forEach(item => {
        item.contentEditable = 'true';
        item.classList.add('editable');
        item.classList.remove('non-editable');
    });
    
    // Mostrar botões de remoção
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.style.display = 'inline-block';
    });
    
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('lock-btn').style.display = 'inline-block';
}

function disableEditing() {
    const editables = document.querySelectorAll('[contenteditable]');
    editables.forEach(item => {
        item.contentEditable = 'false';
        item.classList.add('non-editable');
        item.classList.remove('editable');
    });
    
    // Esconder botões de remoção
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    
    document.getElementById('edit-btn').style.display = 'inline-block';
    document.getElementById('lock-btn').style.display = 'none';
}

// Iniciar com a ficha não editável (mais seguro)
document.addEventListener('DOMContentLoaded', function() {
     initDesperationSystem();
    disableEditing(); // Começa bloqueado
    
    // Configurar eventos dos botões
    document.getElementById('edit-btn').addEventListener('click', enableEditing);
    document.getElementById('lock-btn').addEventListener('click', disableEditing);

    const attributesAndLevel = document.querySelectorAll(
        '.stats-grid div:nth-child(6) .stat-value span, ' + // Nível
        '.stat-box .stat-value span' // Todos os atributos
    );
    
    attributesAndLevel.forEach(element => {
        element.addEventListener('input', calculateDerivedStats);
    });

     setupEquipmentAutocomplete(); // Configura o autocompletar para equipamentos
    
    // Focar no campo de nome quando o modal é aberto
    document.getElementById('equipment-modal').addEventListener('shown.bs.modal', function() {
        document.getElementById('equipment-name').focus();
    });

    setupPathAutocomplete(); // autocomplete para trilhas

});

// Adicione este código ao seu script.js

// Função para exportar a ficha como JSON
function exportCharacterSheet() {
    // Coletar todos os dados da ficha
    const characterData = {
        // Informações básicas
        basicInfo: {
            player: document.querySelector('.stats-grid div:nth-child(1) .stat-value span').textContent,
            name: document.querySelector('.stats-grid div:nth-child(2) .stat-value span').textContent,
            age: document.querySelector('.stats-grid div:nth-child(3) .stat-value span').textContent,
            origin: document.querySelector('.stats-grid div:nth-child(4) .stat-value span').textContent,
            path: document.querySelector('.stats-grid div:nth-child(5) .stat-value span').textContent,
            level: document.querySelector('.stats-grid div:nth-child(6) .stat-value span').textContent,
            xp: document.querySelector('.stats-grid div:nth-child(7) .stat-value span').textContent,
            appearance: document.querySelector('.character-card p').textContent
        },
        
        // Atributos
        attributes: {
            physical: document.querySelectorAll('.stat-box .stat-value span')[0].textContent,
            agility: document.querySelectorAll('.stat-box .stat-value span')[1].textContent,
            strength: document.querySelectorAll('.stat-box .stat-value span')[2].textContent,
            charisma: document.querySelectorAll('.stat-box .stat-value span')[3].textContent,
            intelligence: document.querySelectorAll('.stat-box .stat-value span')[4].textContent,
            cursedEnergy: document.querySelectorAll('.stat-box .stat-value span')[5].textContent
        },
        
        // Status
        status: {
            hp: {
                current: document.getElementById('current-hp').textContent,
                max: document.getElementById('max-hp').textContent
            },
            pa: {
                current: document.getElementById('current-pa').textContent,
                max: document.getElementById('max-pa').textContent
            },
            psy: {
                current: document.getElementById('current-psy').textContent,
                max: document.getElementById('max-psy').textContent
            },
            insanity: document.querySelectorAll('.stat-box .stat-value span')[6].textContent,
            dodge: document.querySelectorAll('.stat-box .stat-value span')[7].textContent
        },
        
       
        // Perícias
        skills: Array.from(document.querySelectorAll('.skill-item')).map(item => {
            const spans = item.querySelectorAll('span');
            const name = spans[0].textContent.trim();
            const valueElement = spans[1].querySelector('.editable') || spans[1];
            const value = valueElement.textContent.trim();
            const attributeMatch = spans[1].textContent.match(/\(([^)]+)\)/);
            const attribute = attributeMatch ? attributeMatch[1] : '';
            
            return {
                name: name,
                value: value,
                attribute: attribute
            };
        }),
        
        // Equipamentos
        equipment: Array.from(document.querySelectorAll('.inventory-item')).map(item => {
            const spans = item.querySelectorAll('span');
            return {
                name: spans[0].textContent,
                damage: spans[1].textContent
            };
        }),
        
        // Maldicoes
        curses: Array.from(document.querySelectorAll('.curse-card')).map(curse => {
        const costElement = curse.querySelector('.curse-cost span');
        const nameElement = curse.querySelector('.curse-name');
        const descriptionElement = curse.querySelector('p:last-of-type'); // Seleciona o último parágrafo
        
        // Extrai o elemento se existir um parágrafo com "Elemento:"
        let element = '';
        const elementParagraph = Array.from(curse.querySelectorAll('p')).find(p => 
            p.textContent.includes('Elemento:')
        );
        
        if (elementParagraph) {
            element = elementParagraph.textContent.replace('Elemento:', '').trim();
        }
        
        // A descrição é o texto do último parágrafo, removendo o elemento se existir
        let description = descriptionElement ? descriptionElement.textContent.trim() : '';
        if (elementParagraph && descriptionElement === elementParagraph) {
            description = description.replace(`Elemento: ${element}`, '').trim();
        }
        
        return {
            name: nameElement ? nameElement.textContent : 'Nova Maldição',
            cost: costElement ? costElement.textContent : '1',
            element: element,
            description: description || 'Descrição da maldição.'
        };
    }),
    
    };
    
    // Criar o JSON
    const jsonData = JSON.stringify(characterData, null, 2);
    
    // Criar um blob com o JSON
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Criar um link para download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ficha_last_paige.json';
    
    // Adicionar ao documento e clicar
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Mostrar notificação
    showNotification('Ficha exportada com sucesso!', 'success');
}

// Função para mostrar notificação
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.5s';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50'; // Verde
    } else {
        notification.style.backgroundColor = '#f44336'; // Vermelho
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Adicione este botão no seu HTML, por exemplo, junto aos controles de edição:
// <button class="edit-btn" onclick="exportCharacterSheet()">Exportar Ficha</button>
// Função para importar ficha de arquivo JSON
function importCharacterSheet(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const characterData = JSON.parse(e.target.result);
            loadCharacterData(characterData);
            showNotification('Ficha carregada com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao carregar o arquivo: ' + error.message, 'error');
            console.error('Erro ao carregar ficha:', error);
        }
    };
    reader.readAsText(file);
    
    // Limpar o input para permitir a seleção do mesmo arquivo novamente
    event.target.value = '';
}

// Função para carregar os dados na ficha
function loadCharacterData(characterData) {
    // Carregar informações básicas
    document.querySelector('.stats-grid div:nth-child(1) .stat-value span').textContent = characterData.basicInfo.player || 'X';
    document.querySelector('.stats-grid div:nth-child(2) .stat-value span').textContent = characterData.basicInfo.name || 'X';
    document.querySelector('.stats-grid div:nth-child(3) .stat-value span').textContent = characterData.basicInfo.age || 'X';
    document.querySelector('.stats-grid div:nth-child(4) .stat-value span').textContent = characterData.basicInfo.origin || 'Ferreiro';
    document.querySelector('.stats-grid div:nth-child(5) .stat-value span').textContent = characterData.basicInfo.path || '-';
    document.querySelector('.stats-grid div:nth-child(6) .stat-value span').textContent = characterData.basicInfo.level || '25';
    document.querySelector('.stats-grid div:nth-child(7) .stat-value span').textContent = characterData.basicInfo.xp || 'X/20';
    document.querySelector('.character-card p').textContent = characterData.basicInfo.appearance || 'X';
    
    // Carregar atributos
    document.querySelectorAll('.stat-box .stat-value span')[0].textContent = characterData.attributes.physical || '13';
    document.querySelectorAll('.stat-box .stat-value span')[1].textContent = characterData.attributes.agility || '11';
    document.querySelectorAll('.stat-box .stat-value span')[2].textContent = characterData.attributes.strength || '12';
    document.querySelectorAll('.stat-box .stat-value span')[3].textContent = characterData.attributes.charisma || '12';
    document.querySelectorAll('.stat-box .stat-value span')[4].textContent = characterData.attributes.intelligence || '14';
    document.querySelectorAll('.stat-box .stat-value span')[5].textContent = characterData.attributes.cursedEnergy || '12';
    
    calculateDerivedStats();
    
    // Carregar status
    document.getElementById('current-hp').textContent = characterData.status.hp.current || '85';
    document.getElementById('max-hp').textContent = characterData.status.hp.max || '85';
    updateHPBar();
    
    document.getElementById('current-pa').textContent = characterData.status.pa.current || '63';
    document.getElementById('max-pa').textContent = characterData.status.pa.max || '63';
    updatePABar();
    
    document.getElementById('current-psy').textContent = characterData.status.psy.current || '40';
    document.getElementById('max-psy').textContent = characterData.status.psy.max || '40';
    updatePsyBar();
    
    document.querySelectorAll('.stat-box .stat-value span')[6].textContent = characterData.status.insanity || 'X';
    document.querySelectorAll('.stat-box .stat-value span')[7].textContent = characterData.status.dodge || '-';
    
    
    
    // Carregar perícias
    const skillItems = document.querySelectorAll('.skill-item');
    if (characterData.skills && characterData.skills.length > 0) {
        skillItems.forEach((item, index) => {
            if (index < characterData.skills.length) {
                const skillData = characterData.skills[index];
                const spans = item.querySelectorAll('span');
                
                
                if (spans.length >= 2) {
                    
                    const attributeMatch = spans[1].textContent.match(/\(([^)]+)\)/);
                    const attribute = attributeMatch ? attributeMatch[1] : '';
                    
                    
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'editable';
                    valueSpan.contentEditable = 'true';
                    valueSpan.textContent = skillData.value || '0';
                    
                   
                    spans[1].innerHTML = '';
                    spans[1].appendChild(valueSpan);
                    
                   
                    if (attribute) {
                        const attributeSpan = document.createElement('span');
                        attributeSpan.textContent = ` (${attribute})`;
                        attributeSpan.className = 'non-editable';
                        spans[1].appendChild(attributeSpan);
                    }
                }
            }
        });
    }

    // Carregar equipamentos
    const equipmentList = document.getElementById('equipment-list');
    equipmentList.innerHTML = '';
    
    if (characterData.equipment && characterData.equipment.length > 0) {
        characterData.equipment.forEach((item, index) => {
            const newEquipmentHTML = `
                <div class="inventory-item" id="equipment-${index + 1}">
                    <span class="editable" contenteditable="true">${item.name || 'Equipamento'}</span>
                    <span class="editable" contenteditable="true">${item.damage || '-'}</span>
                    <button class="delete-btn" onclick="deleteEquipment('equipment-${index + 1}')">Remover</button>
                </div>
            `;
            equipmentList.insertAdjacentHTML('beforeend', newEquipmentHTML);
        });
        equipmentCounter = characterData.equipment.length;
    } else {
        equipmentList.innerHTML = '<p>Nenhum equipamento adicionado ainda.</p>';
        equipmentCounter = 0;
    }
    
    // Carregar maldições
    const cursesList = document.getElementById('curses-list');
    cursesList.innerHTML = '';
    
    if (characterData.curses && characterData.curses.length > 0) {
        characterData.curses.forEach((curse, index) => {
            const newCurseHTML = `
                <div class="curse-card" id="curse-${index + 1}">
                    <div class="curse-cost"><span class="editable" contenteditable="true">${curse.cost || '1'}</span> PA</div>
                    <div class="curse-name editable" contenteditable="true">${curse.name || 'Nova Maldição'}</div>
                    <p class="editable" contenteditable="true">${curse.description || 'Descrição da maldição.'}</p>
                    <button class="delete-btn" onclick="deleteCurse('curse-${index + 1}')">Remover</button>
                </div>
            `;
            cursesList.insertAdjacentHTML('beforeend', newCurseHTML);
        });
        curseCounter = characterData.curses.length;
    }
}

function calculateDerivedStats() {

    // Obter valores dos atributos e nível
    const physical = parseInt(document.querySelectorAll('.stat-box .stat-value span')[0].textContent) || 10;
    const agility = parseInt(document.querySelectorAll('.stat-box .stat-value span')[1].textContent) || 10;
    const cursedEnergy = parseInt(document.querySelectorAll('.stat-box .stat-value span')[5].textContent) || 10;
    const level = parseInt(document.querySelector('.stats-grid div:nth-child(6) .stat-value span').textContent) || 1;
    
    // Calcular HP: 20 + (Físico - 10) * 5 + Level * 2
    const baseHP = 20;
    const hpBonus = (physical > 10) ? (physical - 10) * 5 : 0;
    const hpPerLevel = level * 2;
    const totalHP = baseHP + hpBonus + hpPerLevel;
    
    // Calcular PA: Energia Amaldiçoada + Level * 2
    const totalPA = cursedEnergy + (level * 2);
    
    // Esquiva é igual à Agilidade
    const dodge = agility;
    
    // Atualizar os valores na ficha
    document.getElementById('max-hp').textContent = totalHP;
    document.getElementById('current-hp').textContent = totalHP; // Define HP atual como máximo
    updateHPBar();
    
    document.getElementById('max-pa').textContent = totalPA;
    document.getElementById('current-pa').textContent = totalPA; // Define PA atual como máximo
    updatePABar();
    
    // CORREÇÃO: Selecionar corretamente o elemento da Esquiva
    // Encontra o stat-box que contém "Esquiva" e atualiza seu valor
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
        if (box.querySelector('.stat-name').textContent === 'Esquiva') {
            box.querySelector('.stat-value span').textContent = dodge;
        }
    });

    if (currentPath && currentPath.curses) {
    currentPath.curses.forEach(curse => {
        if (level >= curse.level && !document.getElementById(`curse-${curse.name}`)) {
            addTrilhaCurse(curse);
        }
    });

}

const dtCircle = document.getElementById('curse-dt-circle');
if (dtCircle) {
    dtCircle.textContent = cursedEnergy;
}

}

function setupEquipmentAutocomplete() {
    const nameInput = document.getElementById('equipment-name');
    const damageInput = document.getElementById('equipment-damage');
    
    // Criar elemento de sugestões
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'equipment-suggestions';
    suggestionsDiv.className = 'autocomplete-suggestions';
    nameInput.parentNode.appendChild(suggestionsDiv);
    
    nameInput.addEventListener('input', function() {
       nameInput.addEventListener('input', function() {
    const input = this.value.toLowerCase();
    suggestionsDiv.innerHTML = '';

    let matches = [];

    if (input.length < 1) {
        // Mostrar todas as sugestões se não há input
        matches = predefinedEquipment;
    } else {
        matches = predefinedEquipment.filter(item => 
            item.name.toLowerCase().includes(input)
        );
    }

    if (matches.length > 0) {
        matches.forEach(item => {
            const suggestion = document.createElement('div');
            suggestion.className = 'autocomplete-suggestion';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'suggestion-name';
            nameSpan.textContent = item.name;

            const damageSpan = document.createElement('span');
            damageSpan.className = 'suggestion-damage';
            damageSpan.textContent = item.damage;

            suggestion.appendChild(nameSpan);
            suggestion.appendChild(damageSpan);

            suggestion.onclick = function() {
                nameInput.value = item.name;
                damageInput.value = item.damage;
                suggestionsDiv.style.display = 'none';
            };

            suggestionsDiv.appendChild(suggestion);
        });

        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.style.display = 'none';
    }

    
});

    });
    
    // Esconder sugestões ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target !== nameInput && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

const predefinedEquipment = [
    // Equipamentos básicos
    { name: "Punhal", damage: "1d6" },
    
    // Novos itens
    { name: "Lanterna", damage: "Remove desvantagens em ambientes escuros para o usuário e aliados próximos. 1p" },
    { name: "Mira laser", damage: "Adiciona +1 em pontaria quando acoplada a uma arma. 1p. Inimigos podem testar Percepção vs. Furtividade para se proteger." },
    { name: "Detector de atividade paranormal", damage: "Funciona como sonar, indicando áreas de forte atividade paranormal. 2p" },
    { name: "Colete à prova de balas", damage: "Concede RD balístico 6. 2p" },
    { name: "Escudo de batalha", damage: "Habilidade 'Defesa': teste para reduzir dano físico pela metade. 3 estágios: Bom (normal), Danificado (-2), Quebrado (inútil). Reparo requer armeiro." },
    { name: "Corda", damage: "Teste de Pontaria (Agilidade) para ancorar (+5 em Atletismo para escalar). Pode imobilizar alvos (Força/Agilidade vs. Força do alvo). 1p" },
    { name: "Notebook", damage: "+5 em testes de Tecnologia para pesquisas online. 1p" },
    { name: "Kit hack", damage: "Ação 'Hackear': Inteligência +5 para burlar sistemas. 2p" },
    { name: "Pacote de estimulantes", damage: "Drogas experimentais: Muscular (+1 Força, risco de -1 Int/Dex), Vital (+5 PV ou cura 5 PV, risco de -1 Força), Cerebral (+1 Int, risco de efeito 'Cansado')." },
    { name: "Kit médico", damage: "Recupera 3d6 de HP ou tira um aliado do estado 'morrendo'. 2 usos. 1p" },
    { name: "Kit de arrombamento", damage: "Teste de Destreza +5 para abrir fechaduras. 4 usos. 1p" },
    { name: "Munição", damage: "Recarrega armas balísticas. 1p" },
    { name: "Bolsa de viagens", damage: "10p de espaço no inventário. Não carrega armas." },
    { name: "Bolsa de agente", damage: "20p de espaço no inventário. Armazenamento para equipamentos paranormais." },
    
    // Armas corpo a corpo
    { name: "Espada", damage: "2d6/1d6 (mão dupla). 2p" },
    { name: "Katana", damage: "1d12. 2p" },
    { name: "Mangual", damage: "1d10+1d4 (Força ≥17, crítico x2, distância média). 3p" },
    { name: "Machado", damage: "1d12 (Força ≥17, crítico x2). 3p" },
    { name: "Soco inglês", damage: "1d6 + dano físico (corpo a corpo)." },
    { name: "Bastão", damage: "1d6 (curta distância). 1p" },
    { name: "Nunchaku", damage: "1d8 (corpo a corpo). 2p" },
    { name: "Manopla", damage: "2d8 + dano físico (Força ≥17). 4p" },
    
    // Armas à distância
    { name: "Shuriken", damage: "4d4 (média distância). 1p" },
    { name: "Pacote de lâminas", damage: "3d4 (média distância). 2p" },
    { name: "Arco e flecha", damage: "1d12 (longa distância). 1p" },
    { name: "Besta", damage: "2d6 (média distância). 2p" },
    { name: "Lança", damage: "1d10 (curta distância). 3p" },

    { name: "Glock", damage: "2d6 (média distância). 2p" },
    { name: "Pistola", damage: "2d6 (média distância). 2p" },
    { name: "Deagle", damage: "2d8 (média distância). 2p" },
    { name: "Magnum", damage: "3d6 (média distância). 3p" },
    { name: "AK-47", damage: "3d8 (média distância)." }, // (Sem custo? Ajuste se necessário)

    // Armas de fogo (longa distância)
    { name: "Rifle de caça", damage: "1d12 (longa distância). 2p" },
    { name: "Sniper", damage: "2d12 (longa distância). 4p" },

    // Armas de fogo (curta distância)
    { name: "Shotgun", damage: "2d6 (curta distância) ou 1d6 (média distância). 2p" },

    // Armas pesadas (requisitos de força)
    { name: "Minigun", damage: "6d6 (média distância, Força ≥17). 5p" },

    // Explosivos
    { name: "Granada", damage: "6d6 (área). 2p" },
    { name: "Bazuca", damage: "6d8 (área, Força ≥17). 3p" },
    { name: "Mina", damage: "6d6 (armadilha). 3p" },

    // Armas flamejantes
    { name: "Lança-chamas", damage: "5d6 (curta distância). 4p" },
    { name: "Molotov", damage: "6d6 (área)." }
];

const predefinedPaths = [{
    name: "Investigador Paranormal",
    summary: "Facilidade para investigar casos paranormais com afinidade com o pós-Éden, percebendo texturas do sobrenatural.",
    curses: [
        { 
            level: 5, 
            name: "Percepção Paranormal", 
            cost: "Passivo", 
            element: "N/A", 
            description: "Teste de percepção para detectar energia amaldiçoada (criaturas, amaldiçoados ou objetos próximos). +2 em Investigação/Ocultismo em cenas paranormais." 
        },
        { 
            level: 10, 
            name: "Análise Sobrenatural", 
            cost: "Ação", 
            element: "N/A", 
            description: "Teste de energia paranormal para descobrir elemento, estado (forte/fraca/morrendo) e fraquezas de criaturas. +1 em testes contra a criatura analisada." 
        },
        { 
            level: 15, 
            name: "Especialização Elemental", 
            cost: "Passivo", 
            element: "N/A", 
            description: "Resistência 5 em elemento de especialização. +2 em quaisquer perícias contra criaturas desse elemento." 
        },
        { 
            level: 20, 
            name: "Teoria das Maldições", 
            cost: "Passivo", 
            element: "N/A", 
            description: "Aumenta DT de maldições em +2." 
        },
        { 
            level: 25, 
            name: "Mímese Arcano", 
            cost: "Reação", 
            element: "N/A", 
            description: "Ao presenciar uma maldição, teste de energia paranormal (vs DT do alvo) para copiá-la por 1 cena." 
        },
        { 
            level: 30, 
            name: "Onisciência Paranormal", 
            cost: "Passivo", 
            element: "N/A", 
            description: "Resistência 5 para todos elementos (10 para especialização). +1 dado contra criaturas da especialização." 
        },
        { 
            level: 40, 
            name: "Desconstrução Amaldiçoada", 
            cost: "20 PA", 
            element: "N/A", 
            description: "Teste de reação para anular maldições direcionadas a você/aliados adjacentes ou remover buffs amaldiçoados de inimigos." 
        },
        { 
            level: 50, 
            name: "Linguagem da Realidade", 
            cost: "Passivo", 
            element: "N/A", 
            description: "Domina a língua $+°©{√3B¿ (ler escrituras rúnicas, comunicação universal). Aprende a maldição exclusiva &!!p↓×®%." 
        }
    ]
    
}, 
{
    name: "Barreira",
    summary: "Especialista em defesa física, capaz de absorver, reduzir e até anular completamente ataques inimigos, evoluindo para técnicas de proteção avançadas.",
    curses: [
        {
            level: 1,
            name: "Defesa Básica",
            cost: "Reação",
            element: "N/A",
            description: "Perícia especial 'Defesa'. Teste para reduzir dano físico recebido em 50% do valor de Físico. Pode ser combinada com equipamentos de proteção."
        },
        {
            level: 5,
            name: "Postura Defensiva",
            cost: "Passivo",
            element: "N/A",
            description: "+2 na perícia Defesa."
        },
        {
            level: 10,
            name: "Anulação Perfeita",
            cost: "Reação (Crítico)",
            element: "N/A",
            description: "Ao acertar um crítico no teste de Defesa, anula completamente o dano de um ataque físico."
        },
        {
            level: 15,
            name: "Proteção Aliada",
            cost: "13 PA (Reação)",
            element: "N/A",
            description: "Defende um aliado em curta distância. Cooldown: 1d4 rodadas."
        },
        {
            level: 20,
            name: "Resiliência Aprimorada",
            cost: "Passivo",
            element: "N/A",
            description: "Ganha +5 de Redução de Dano (RD)."
        },
        {
            level: 25,
            name: "Barreira Balística",
            cost: "Passivo",
            element: "N/A",
            description: "Pode defender contra projéteis (incluindo armas de fogo)."
        },
        {
            level: 30,
            name: "Contra-Ataque",
            cost: "Reação (Crítico)",
            element: "N/A",
            description: "Ao anular um ataque com crítico, realiza um contra-ataque imediato. Cooldown: 1d4 rodadas."
        },
        {
            level: 40,
            name: "Corpo Inquebrável",
            cost: "Passivo",
            element: "N/A",
            description: "+5 de RD adicional (totalizando +10 desde o nível 20)."
        },
        {
            level: 50,
            name: "Escudo Ancestral",
            cost: "1 Rodada (Ritual)",
            element: "N/A",
            description: "Invoca um escudo mágico (30 RD) que protege você e aliados atrás de você. Pode ser lançado como ataque (2d10 + Força). O escudo racha com ataques que superem sua RD – quebra após 10 ataques bem-sucedidos. Recarrega na próxima cena."
        }
    ]
},
{
    name: "Patrono da Vida",
    summary: "Mestre da medicina e cura, capaz de realizar procedimentos avançados em qualquer situação e até invocar técnicas ancestrais de restauração.",
    curses: [
        {
            level: 1,
            name: "Primeiros Socorros",
            cost: "Passivo",
            element: "N/A",
            description: "+1 em testes de Medicina. Kit médico com 3 usos. Soma a perícia Medicina em rolagens de cura."
        },
        {
            level: 5,
            name: "Especialista Médico",
            cost: "Passivo",
            element: "N/A",
            description: "Kit médico cura 6d6. +1 adicional em Medicina (total +2 desde nível 1)."
        },
        {
            level: 10,
            name: "Improvisação de Emergência",
            cost: "Ação Completa",
            element: "N/A",
            description: "Teste de Sobrevivência para improvisar kit médico ou antídoto em qualquer situação."
        },
        {
            level: 15,
            name: "Cura em Massa",
            cost: "13 PA por alvo",
            element: "N/A",
            description: "Cura múltiplos alvos na mesma ação (custo cumulativo)."
        },
        {
            level: 20,
            name: "Tratamento Rápido",
            cost: "Ação de Movimento",
            element: "N/A",
            description: "Substitui ação de movimento por teste de Medicina."
        },
        {
            level: 25,
            name: "Último Suspiro",
            cost: "20 PA (Reação)",
            element: "N/A",
            description: "Quando aliado adjacente entra em estado 'morrendo', recupera vida igual ao dano recebido."
        },
        {
            level: 30,
            name: "Kit Inesgotável",
            cost: "Passivo",
            element: "N/A",
            description: "Kit médico dura missão inteira. Cura 6d8. +1 em Medicina (total +3)."
        },
        {
            level: 40,
            name: "Mantra da Renascença",
            cost: "10 PA + 5 PA/turno",
            element: "N/A",
            description: "Cura permanente em área (15m): aliados curam 2d6/turno. Requer concentração total (sem comunicação)."
        },
        {
            level: 50,
            name: "Escudo contra a Morte",
            cost: "20 PA (Reação)",
            element: "N/A",
            description: "Aliado adjacente leva crítico → teste de Medicina para mitigar efeito."
        }
    ]
},
{
    name: "Técnico Paranormal",
    summary: "Especialista em otimizar objetos paranormais, extraindo o máximo potencial de armas, equipamentos e artefatos sobrenaturais.",
    curses: [
        {
            level: 5,
            name: "Ajuste Ofensivo",
            cost: "Passivo",
            element: "N/A",
            description: "Objetos paranormais de dano recebem +3 de bônus."
        },
        {
            level: 10,
            name: "Sintonia Pericial",
            cost: "Passivo",
            element: "N/A",
            description: "Objetos que concedem bônus em perícias dão +2 adicional."
        },
        {
            level: 15,
            name: "Sobrecarga de Dados",
            cost: "Passivo",
            element: "N/A",
            description: "Objetos que concedem dados extras agora dão +2 dados (em vez de +1)."
        },
        {
            level: 20,
            name: "Barreira Reforçada",
            cost: "Passivo",
            element: "N/A",
            description: "Objetos de proteção somam metade de seu RD ao RD principal do usuário."
        },
        {
            level: 25,
            name: "Selagem Amplificada",
            cost: "Passivo",
            element: "N/A",
            description: "Objetos de selamento têm sua eficácia aumentada (efeitos determinados pelo Mestre)."
        },
        {
            level: 30,
            name: "Alquimia Avançada",
            cost: "Passivo",
            element: "N/A",
            description: "Poções de reconstituição triplicam seus dados de cura (ex: 1d6 → 3d6)."
        },
        {
            level: 40,
            name: "Simbiose Paranormal",
            cost: "Passivo",
            element: "N/A",
            description: "+5 em testes de Paranormal ao portar objetos paranormais. Soma a perícia Paranormal em rolagens de dano/cura com esses objetos."
        },
        {
            level: 50,
            name: "Relíquia Primordial",
            cost: "Único",
            element: "N/A",
            description: "Ganha um objeto paranormal de classe S (efeitos únicos, a definir pelo Mestre). Exemplos: Arma que corta dimensões, armadura que absorve maldições, etc."
        }
    ]
},
{
    name: "Artesão Paranormal",
    summary: "Mestre da criação de objetos amaldiçoados, transformando matérias-primas paranormais em equipamentos poderosos - com riscos imprevisíveis.",
    curses: [
        {
            level: 1,
            name: "Ofício Amaldiçoado",
            cost: "1x/sessão",
            element: "N/A",
            description: "Teste de Ocultismo para criar itens paranormais. Sucesso: item criado. Falha: matéria-prima perdida. Falha crítica: item descontrolado (efeito aleatório)."
        },
        {
            level: 5,
            name: "Aprendiz das Runas",
            cost: "Passivo",
            element: "N/A",
            description: "Itens criados são de classe F (básicos)."
        },
        {
            level: 10,
            name: "Artífice das Sombras",
            cost: "Passivo",
            element: "N/A",
            description: "Itens evoluem para classe E."
        },
        {
            level: 15,
            name: "Mestre da Forja Obscura",
            cost: "Passivo",
            element: "N/A",
            description: "Itens classe D."
        },
        {
            level: 20,
            name: "Archote da Corrupção",
            cost: "Passivo",
            element: "N/A",
            description: "Itens classe C. "
        },
        {
            level: 25,
            name: "Lâmina do Abismo",
            cost: "Passivo",
            element: "N/A",
            description: "Itens classe B."
        },
        {
            level: 30,
            name: "Forjador de Realidades",
            cost: "Passivo",
            element: "N/A",
            description: "Itens classe A."
        },
        {
            level: 40,
            name: "Mãos do Deus Proibido",
            cost: "Passivo",
            element: "N/A",
            description: "Itens classe S."
        },
        {
            level: 50,
            name: "Obra-Prima do Caos",
            cost: "Único",
            element: "N/A",
            description: "Cria 1 item classe X."
        }
    ]
}, 
{
    name: "Imortal",
    summary: "Possui um pacto com a morte, ganhando habilidades regenerativas e defesas sobrenaturais que se ativam em situações extremas.",
    curses: [
        {
            level: 1,
            name: "Pacto de Sangue",
            cost: "Passivo",
            element: "N/A",
            description: "Ao chegar à metade da vida, cura 3d6 PV automaticamente."
        },
        {
            level: 5,
            name: "Corpo Fortificado",
            cost: "Passivo",
            element: "N/A",
            description: "+2 em Físico e +2 na perícia Instabilidade."
        },
        {
            level: 10,
            name: "Instinto de Sobrevivência",
            cost: "Passivo",
            element: "N/A",
            description: "Na metade da vida: +2 em Esquiva e ataques."
        },
        {
            level: 15,
            name: "Reserva Vital",
            cost: "13 PA",
            element: "N/A",
            description: "Ganha 3d6 de vida temporária (acima do máximo) antes de batalhas."
        },
        {
            level: 20,
            name: "Inalterável",
            cost: "Passivo",
            element: "N/A",
            description: "Imunidade a sangramento e veneno. Estanca feridas automaticamente."
        },
        {
            level: 25,
            name: "Espinhos de Sangue",
            cost: "Reação",
            element: "N/A",
            description: "Ao sofrer ataque corpo a corpo, causa 1d12 de dano retroativo."
        },
        {
            level: 30,
            name: "Regeneração Caótica",
            cost: "Reação (Crítico)",
            element: "N/A",
            description: "Ao levar crítico: role 1d6. Se resultar em 6, cura 2d6 PV."
        },
        {
            level: 40,
            name: "Fênix Negra",
            cost: "Passivo",
            element: "N/A",
            description: "Ao chegar a 0 PV, o último dano recebido vira cura (1x/cena)."
        },
        {
            level: 50,
            name: "Renascimento das Cinzas",
            cost: "Passivo",
            element: "N/A",
            description: "Ao voltar de 'morrendo': +1 dado em ataques e crítico reduzido em -1."
        }
    ]
},
{
    name: "Invencível",
    summary: "Lenda viva cuja presença debilita inimigos e inspira aliados, dominando o campo de batalha com táticas e autoridade.",
    curses: [
        {
            level: 5,
            name: "Aura do Vencedor",
            cost: "Passivo",
            element: "N/A",
            description: "Inimigos devem passar em teste de Vontade (DT = seu Diplomacia) ou sofrer -2 em ataques contra você."
        },
        {
            level: 10,
            name: "Leitura de Combate",
            cost: "1 Turno",
            element: "N/A",
            description: "Teste de Luta para identificar ponto fraco. Sucesso: +1 dado no próximo ataque."
        },
        {
            level: 15,
            name: "Grito de Guerra",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Diplomacia para conceder +2 em testes a aliados por 1 cena."
        },
        {
            level: 20,
            name: "Foco no Alvo",
            cost: "Passivo",
            element: "N/A",
            description: "Se identificar ponto fraco (nível 10), todos ataques contra o alvo ganham +1 dado permanentemente."
        },
        {
            level: 25,
            name: "Comando Tático",
            cost: "15 PA + Ação",
            element: "N/A",
            description: "Teste de Diplomacia (DT 15) para dar +1 dado de dano a aliados por 1 rodada."
        },
        {
            level: 30,
            name: "Corpo Perfeito",
            cost: "Passivo",
            element: "N/A",
            description: "+4 em Força e +2 em Luta."
        },
        {
            level: 40,
            name: "Lenda Viva",
            cost: "Passivo",
            element: "N/A",
            description: "+5 em Diplomacia e RD 10 universal."
        },
        {
            level: 50,
            name: "Dominação Absoluta",
            cost: "20 PA",
            element: "N/A",
            description: "Inimigos fracos/feridos devem passar em teste de Vontade ou escolher: juntar-se a você, render-se ou fugir."
        }
    ]
},
{
    name: "Domador de Bestas",
    summary: "Controla criaturas paranormais através de voz, olhar e presença, manipulando-as com técnicas que variam de persuasão a dominação absoluta.",
    curses: [
        {
            level: 5,
            name: "Ordem de Afastamento",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Diplomacia vs Vontade. Se a criatura falhar, evita combatê-lo por 1d4 turnos."
        },
        {
            level: 10,
            name: "Olhar Paralisante",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Intimidação vs Vontade. Falha: criatura paralizada por 1d4 rodadas."
        },
        {
            level: 15,
            name: "Controle Bestial",
            cost: "Ação",
            element: "N/A",
            description: "Força criatura a atacar aliados com teste de Vontade para resistir."
        },
        {
            level: 20,
            name: "Grito da Fera",
            cost: "15 PA",
            element: "N/A",
            description: "Teste de Intimidação. Sucesso: criaturas sofrem -1 dado contra você por 1d4 rodadas."
        },
        {
            level: 25,
            name: "Predador Alfa",
            cost: "20 PA",
            element: "N/A",
            description: "+5 de dano e +1 dado em testes contra criaturas por 1d4 rodadas."
        },
        {
            level: 30,
            name: "Inevitabilidade",
            cost: "Passivo",
            element: "N/A",
            description: "Criaturas têm -10 em Esquiva contra você."
        },
        {
            level: 40,
            name: "Decreto do Domador",
            cost: "20 PA",
            element: "N/A",
            description: "Criaturas fracas/feridas devem escolher: juntar-se a você, render-se ou fugir (teste de Vontade para resistir)."
        },
        {
            level: 50,
            name: "Voz do Abismo",
            cost: "20 PA",
            element: "N/A",
            description: "Criaturas com metade da vida que falharem na DT amaldiçoada são obliteradas instantaneamente."
        }
    ]
},
{
    name: "Caronte",
    summary: "Intermediário entre os vivos e as almas esquecidas, capaz de purificá-las, invocar sombras e manipular a essência espiritual.",
    curses: [
        {
            level: 5,
            name: "Purificador de Almas",
            cost: "Passivo",
            element: "N/A",
            description: "+1 dado contra criaturas esquecidas. Derrotá-las gera cristais de alma (purificação em vez de morte)."
        },
        {
            level: 10,
            name: "Pacto de Neutralidade",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Diplomacia para fazer esquecidos agirem com neutralidade ou simpatia."
        },
        {
            level: 15,
            name: "Golpe da Alma",
            cost: "Passivo",
            element: "N/A",
            description: "Substitui testes de Luta/Pontaria por Energia Paranormal (+2 no acerto e soma do atributo ao dano)."
        },
        {
            level: 20,
            name: "Aliado Esquecido",
            cost: "Missão",
            element: "N/A",
            description: "Convence um esquecido a ajudar (exige descobrir nome completo ou objeto importante em vida)."
        },
        {
            level: 25,
            name: "Barreira Espiritual",
            cost: "20 PA",
            element: "N/A",
            description: "Escudo de alma com +30 PV temporários."
        },
        {
            level: 30,
            name: "Melodia da Vida",
            cost: "Ação",
            element: "N/A",
            description: "Cura 5d6 em aliados num raio de 6m."
        },
        {
            level: 40,
            name: "Invocação das Sombras",
            cost: "20 PA",
            element: "N/A",
            description: "Invoca espíritos de mortos ligados a você (mais fortes que esquecidos)."
        },
        {
            level: 50,
            name: "Cântico Final",
            cost: "Escolha",
            element: "N/A",
            description: "Escolha 1: \n- **Melodia da Morte**: 5d12 de dano de alma/rodada (incurável exceto por cristais). \n- **Melodia da Alma**: Aliados ganham +3d10 PV temporários e +1 dado em testes/dano."
        }
    ]
},
{
    name: "Sensitivo",
    summary: "Percebe perigos antes que aconteçam, usando intuição sobrenatural para evitar desastres e manipular a sorte a seu favor.",
    curses: [
        {
            level: 5,
            name: "Premonição",
            cost: "Passivo",
            element: "N/A",
            description: "Ao entrar em uma cena, o Mestre rola um dado secreto para alertar sobre ameaças ocultas (pessoas, objetos ou criaturas perigosas)."
        },
        {
            level: 10,
            name: "Sexto Sentido",
            cost: "Reação",
            element: "N/A",
            description: "Ganha 1 ação extra para evitar perigos iminentes (esconder-se, desviar de armadilhas). +2 em Iniciativa."
        },
        {
            level: 15,
            name: "Sorte Improvável",
            cost: "Reação (Crítico)",
            element: "N/A",
            description: "Ao sofrer um ataque crítico, role um dado. Se também tirar crítico, o ataque inimigo erra automaticamente."
        },
        {
            level: 20,
            name: "Esquiva Instintiva",
            cost: "Passivo",
            element: "N/A",
            description: "+5 em Esquiva."
        },
        {
            level: 25,
            name: "Visão do Futuro",
            cost: "20 PA",
            element: "N/A",
            description: "Teste de Intuição para prever o próximo ataque inimigo. Se explicar lógicamente como evitar, anula o ataque sem rolagem. Cooldown: 1d4 rodadas."
        },
        {
            level: 30,
            name: "Maldição do Azar",
            cost: "20 PA",
            element: "N/A",
            description: "Marca um alvo: falha crítica dele passa a ser 10+."
        },
        {
            level: 40,
            name: "Amuleto da Sorte",
            cost: "Passivo",
            element: "N/A",
            description: "Vantagem (+1d20) em todos os testes. Se quebrar: desvantagem (-1d20) até ser reparado."
        },
        {
            level: 50,
            name: "Auréola da Fortuna",
            cost: "20 PA",
            element: "N/A",
            description: "Seu crítico vira 15+. Aliados em média distância ganham efeito do Amuleto da Sorte por 1 cena."
        }
    ]
},
{
    name: "Gênio",
    summary: "Intelecto excepcional que permite dominar habilidades rapidamente, adaptar-se a situações e explorar fraquezas inimigas com precisão científica.",
    curses: [
        {
            level: 5,
            name: "Aprendizado Acelerado",
            cost: "Passivo",
            element: "N/A",
            description: "Primeiro ponto investido em qualquer perícia conta como +2."
        },
        {
            level: 10,
            name: "Adaptação Tática",
            cost: "Passivo",
            element: "N/A",
            description: "Substitui Agilidade por Inteligência em Pontaria, Inteligência por Luta (ataques vitais) e Inteligência por Esquiva (previsão estratégica)."
        },
        {
            level: 15,
            name: "Ilusão de Perigo",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Enganação para fazer inimigos acreditarem que você é uma ameaça colossal (-2 em ataques contra você)."
        },
        {
            level: 20,
            name: "Análise de Campo",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Inteligência puro para identificar posições vantajosas em batalha. +2 em Pontaria."
        },
        {
            level: 25,
            name: "Estimulante Cerebral",
            cost: "15 PA",
            element: "N/A",
            description: "Usa efeito de estimulante sem desvantagens. Ação para encontrar ponto fraco: +2d6 de dano e causa sangramento."
        },
        {
            level: 30,
            name: "Improvisação Criativa",
            cost: "20 PA",
            element: "N/A",
            description: "Usa o cenário para efeitos táticos (ex: derrubar lustres, desarmar inimigos). Dano e efeitos definidos pelo Mestre."
        },
        {
            level: 40,
            name: "Polímata",
            cost: "Passivo",
            element: "N/A",
            description: "+2 em todas as perícias de Inteligência."
        },
        {
            level: 50,
            name: "Mimetismo Cognitivo",
            cost: "20 PA",
            element: "N/A",
            description: "Copia 2 habilidades de inimigos/aliados por 1 cena (teste de Inteligência vs DT do alvo)."
        }
    ]
},
{
    name: "Armeiro",
    summary: "Especialista em modificações táticas, capaz de aprimorar armas e equipamentos durante missões com melhorias temporárias.",
    curses: [
        {
            level: 5,
            name: "Melhoria Assertiva",
            cost: "1 uso do kit",
            element: "N/A",
            description: "+2 de acerto em armas corpo a corpo ou balísticas."
        },
        {
            level: 10,
            name: "Melhoria Ampliar",
            cost: "1 uso do kit",
            element: "N/A",
            description: "+5 de dano na arma modificada."
        },
        {
            level: 15,
            name: "Melhoria Lock On",
            cost: "1 uso do kit",
            element: "N/A",
            description: "Aumenta alcance (curto→médio, médio→longo). Armas longas ganham +1 dado de dano."
        },
        {
            level: 20,
            name: "Melhoria Destruidora",
            cost: "1 uso do kit",
            element: "N/A",
            description: "Reduz crítico da arma em 2 níveis (ex: 20 → 18)."
        },
        {
            level: 25,
            name: "Melhoria Repetição/Leve",
            cost: "1 uso do kit",
            element: "N/A",
            description: "Balísticas: atira 2x/ataque. Corpo a corpo: 2 ataques/turno."
        },
        {
            level: 30,
            name: "Melhoria Explosiva",
            cost: "1 uso do kit",
            element: "N/A",
            description: "Projéteis causam +2d6 de dano explosivo no alvo."
        },
        {
            level: 40,
            name: "Sobrecarga de Melhorias",
            cost: "3 usos do kit",
            element: "N/A",
            description: "Aplica 3 melhorias simultâneas em uma arma."
        },
        {
            level: 50,
            name: "Torreta Automática",
            cost: "Único",
            element: "N/A",
            description: "Cria robô torreta (150 PV, 2d12 de dano, crítico 19). Usa seu acerto. Bloqueia 1 slot de kit até ser destruída."
        }
    ]
},
{
    name: "Sangue Quente",
    summary: "Transforma dor em poder, com habilidades que incentivam combate agressivo e manipulação sanguinária.",
    curses: [
        {
            level: 5,
            name: "Vigor Inabalável",
            cost: "Passivo",
            element: "N/A",
            description: "+1 PV por nível."
        },
        {
            level: 10,
            name: "Indomável",
            cost: "Passivo",
            element: "N/A",
            description: "Imune a sangramento e atordoado."
        },
        {
            level: 15,
            name: "Golpes Precários",
            cost: "Ataque",
            element: "N/A",
            description: "Teste de Luta/Pontaria para infligir sangramento."
        },
        {
            level: 20,
            name: "Fúria da Dor",
            cost: "15 PA",
            element: "N/A",
            description: "Na metade da vida: teste de Físico para ganhar RD 10 temporário."
        },
        {
            level: 25,
            name: "Intimidação Sádica",
            cost: "Ação",
            element: "N/A",
            description: "Teste de Intimidação vs Vontade para dar -2 em ataques inimigos contra você."
        },
        {
            level: 30,
            name: "Banquete de Sangue",
            cost: "Livre/Ação",
            element: "N/A",
            description: "Consumir sangue recupera 2d6 PV. Livre se usar arma corpo a corpo."
        },
        {
            level: 40,
            name: "Circulação Frenética",
            cost: "Passivo",
            element: "N/A",
            description: "2 ataques extras por cena."
        },
        {
            level: 50,
            name: "Domínio Hemático",
            cost: "20 PA",
            element: "N/A",
            description: "Controle o sangue de alvos sangrando: 5d8 de dano. Crítico: quebra membro (1d4). Falha crítica do alvo: 5→paraplegia, 6→morte instantânea."
        }
    ]
},
{
    name: "Punho de Ferro",
    summary: "Mestre do combate desarmado, usando técnicas brutais que transformam seus punhos em armas letais.",
    curses: [
        {
            level: 5,
            name: "Soco Básico",
            cost: "Passivo",
            element: "N/A",
            description: "Dano com mãos nuas: 1d6 + Força."
        },
        {
            level: 10,
            name: "Corpo Esculpido",
            cost: "Passivo",
            element: "N/A",
            description: "+4 em Força e +2 em Luta."
        },
        {
            level: 15,
            name: "Impacto Certeiro",
            cost: "Passivo",
            element: "N/A",
            description: "Dano com mãos nuas: 2d6 + Força."
        },
        {
            level: 20,
            name: "Técnica Marcial",
            cost: "Passivo",
            element: "N/A",
            description: "Soma bônus de Luta ao dano de mãos nuas."
        },
        {
            level: 25,
            name: "Punho de Aço",
            cost: "Passivo",
            element: "N/A",
            description: "Dano com mãos nuas: 3d6 + Força."
        },
        {
            level: 30,
            name: "Golpe Atordoante",
            cost: "20 PA",
            element: "N/A",
            description: "Deixa inimigo atordoado por 1 cena (teste de Resistência para reduzir)."
        },
        {
            level: 40,
            name: "Nocaute Implacável",
            cost: "Crítico",
            element: "N/A",
            description: "Críticos nocauteiam o alvo (atordoado, Esquiva = 0). Teste de Físico DT 15 para recuperar."
        },
        {
            level: 50,
            name: "Fúria Concentrada",
            cost: "20 PA",
            element: "N/A",
            description: "Soma metade da Força ao dano (acumulativo com outros bônus)."
        }
    ]
},
{
    name: "Mestre das Bestas",
    summary: "Forma laços com criaturas paranormais, dominando-as e evoluindo-as como companheiras de batalha.",
    curses: [
        {
            level: 5,
            name: "Companheiro F",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura de nível F."
        },
        {
            level: 10,
            name: "Companheiro E",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura evolui para nível E."
        },
        {
            level: 15,
            name: "Companheiro D",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura evolui para nível D."
        },
        {
            level: 20,
            name: "Companheiro C",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura evolui para nível C."
        },
        {
            level: 25,
            name: "Companheiro B",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura evolui para nível B."
        },
        {
            level: 30,
            name: "Companheiro A",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura evolui para nível A."
        },
        {
            level: 40,
            name: "Companheiro S",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura evolui para nível S."
        },
        {
            level: 50,
            name: "Companheiro X",
            cost: "Passivo",
            element: "N/A",
            description: "Criatura alcança nível X."
        }
    ]
    
},
{
    name: "Veloz",
    summary: "Combate em velocidade sobre-humana, com esquivas impossíveis, múltiplas ações e movimentos que desafiam a percepção inimiga.",
    curses: [
        {
            level: 5,
            name: "Reflexos Afiados",
            cost: "Passivo",
            element: "Agilidade",
            description: "+5 em Esquiva."
        },
        {
            level: 10,
            name: "Movimento Acelerado",
            cost: "Passivo",
            element: "Mobilidade",
            description: "Ganha **2 ações de movimento** por turno."
        },
        {
            level: 15,
            name: "Golpes Velozes",
            cost: "Passivo",
            element: "Adaptação",
            description: "Substitui **Força por Agilidade** em testes de Luta, com **+2 de bônus**."
        },
        {
            level: 20,
            name: "Esquiva Balística",
            cost: "Passivo",
            element: "Precisão",
            description: "Pode usar **Esquiva contra ataques à distância** (balas, flechas, projéteis)."
        },
        {
            level: 25,
            name: "Aceleração Instantânea",
            cost: "20 PA",
            element: "Tempo",
            description: "Ganha **2 ações padrão extras** em uma cena."
        },
        {
            level: 30,
            name: "Fúria Veloz",
            cost: "Passivo",
            element: "Evasão",
            description: "Inimigos sofrem **-2 em ataques contra você** devido à sua velocidade."
        },
        {
            level: 40,
            name: "Intervenção Relâmpago",
            cost: "20 PA (Reação)",
            element: "Proteção",
            description: "Se um aliado a **curta distância** for atacado, você pode movê-lo instantaneamente, concedendo **+5 em Esquiva** contra o ataque."
        },
        {
            level: 50,
            name: "Turbilhão de Ações",
            cost: "Passivo",
            element: "Velocidade",
            description: "**Críticos concedem um ataque extra.** Ação 'Empurrar' move você ou outro ser **25m** (livre 1x/turno)."
        }
    ]
}]

function setupPathAutocomplete() {
    const pathInput = document.querySelector('.stats-grid div:nth-child(5) .stat-value span');

    const pathSuggestions = document.createElement('div');
    pathSuggestions.id = 'path-suggestions';
    pathSuggestions.className = 'autocomplete-suggestions';
    pathInput.parentNode.appendChild(pathSuggestions);

    pathInput.addEventListener('input', function () {
        const input = this.textContent.toLowerCase();
        pathSuggestions.innerHTML = '';

        let matches = input.length < 1
            ? predefinedPaths
            : predefinedPaths.filter(path => path.name.toLowerCase().includes(input));

        if (matches.length > 0) {
            matches.forEach(path => {
                const suggestion = document.createElement('div');
                suggestion.className = 'autocomplete-suggestion';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'suggestion-name';
                nameSpan.textContent = path.name;

                const summarySpan = document.createElement('span');
                summarySpan.className = 'suggestion-damage'; // reaproveitando classe
                summarySpan.textContent = path.summary;

                suggestion.appendChild(nameSpan);
                suggestion.appendChild(summarySpan);

                suggestion.onclick = function () {
                    pathInput.textContent = path.name;
                    pathSuggestions.style.display = 'none';
                    currentPath = predefinedPaths.find(p => p.name === path.name);
calculateDerivedStats(); // força atualização das maldições com base no nível

                };

                pathSuggestions.appendChild(suggestion);
            });
            pathSuggestions.style.display = 'block';
        } else {
            pathSuggestions.style.display = 'none';
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target !== pathInput && !pathSuggestions.contains(e.target)) {
            pathSuggestions.style.display = 'none';
        }
    });

    pathInput.addEventListener('focus', function () {
        pathInput.dispatchEvent(new Event('input'));
    });
}

function addTrilhaCurse(curseData) {
    const curseId = `curse-${curseData.name.replace(/\s+/g, '-')}`;

    // Evitar duplicadas
    if (document.getElementById(curseId)) return;

    const newCurseHTML = `
        <div class="curse-card" id="${curseId}">
            <div class="curse-cost"><span class="editable" contenteditable="true">${curseData.cost}</span> PA</div>
            <div class="curse-name editable" contenteditable="true">${curseData.name}</div>
            ${curseData.element ? `<p><strong>Elemento:</strong> ${curseData.element}</p>` : ''}
            <p class="editable" contenteditable="true">${curseData.description}</p>
            <button class="delete-btn" onclick="deleteCurse('${curseId}')">Remover</button>
        </div>
    `;

    document.getElementById('curses-list').insertAdjacentHTML('beforeend', newCurseHTML);
}

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    const favicon = document.querySelector("link[rel='icon']");
    
    isBloodMoonTheme = !isBloodMoonTheme;
    
    if (isBloodMoonTheme) {
        body.classList.add('bloodmoon');
        themeBtn.textContent = 'D.I.P';
        themeBtn.className = 'dip-btn';
        favicon.href = 'bloodmoon.ico'; // Você precisa ter este arquivo
    } else {
        body.classList.remove('bloodmoon');
        themeBtn.textContent = 'Blood Moon';
        themeBtn.className = 'bloodmoon-btn';
        favicon.href = 'favicon.ico'; // Volta para o ícone original
    }
}

function initDesperationSystem() {
    const container = document.querySelector('.desperation-boxes');
    
    // Cria 15 caixas (1-15)
    for (let i = 1; i <= 15; i++) {
        const box = document.createElement('div');
        box.className = 'desperation-box';
        box.textContent = i;
        box.dataset.level = i;
        
        // Adiciona tooltip com efeito se existir
        if (desperationEffects[i]) {
            box.dataset.effect = desperationEffects[i];
        }
        
        box.addEventListener('click', function() {
            toggleDesperation(this);
        });
        
        container.appendChild(box);
    }
}

// Alterna o estado da caixa de Desespero
function toggleDesperation(box) {
    const level = parseInt(box.dataset.level);
    const currentLevel = parseInt(document.getElementById('desperation-level').textContent);
    
    // Se clicar em uma caixa menor ou igual à atual, define até aquela
    if (level <= currentLevel) {
        setDesperation(level);
    } 
    // Se clicar em uma caixa maior, define até a nova
    else {
        setDesperation(level);
    }
}

// Define o nível de Desespero
function setDesperation(level) {
    const boxes = document.querySelectorAll('.desperation-box');
    const levelDisplay = document.getElementById('desperation-level');
    
    // Atualiza todas as caixas
    boxes.forEach(box => {
        const boxLevel = parseInt(box.dataset.level);
        
        if (boxLevel <= level) {
            box.classList.add('filled');
        } else {
            box.classList.remove('filled');
        }
    });
    
    levelDisplay.textContent = level;
    
    // Aplica efeitos automáticos (opcional)
    applyDesperationEffects(level);
}

// Aplica efeitos automáticos (opcional)
function applyDesperationEffects(level) {
    // Exemplo: Se nível 15, adiciona 1 de Insanidade
    if (level === 15) {
        const insanityElement = document.querySelector('.stat-box:nth-child(4) .stat-value span');
        const currentInsanity = parseInt(insanityElement.textContent) || 0;
        insanityElement.textContent = currentInsanity + 1;
        showNotification("+1 de Insanidade (Desespero Nível 15)", "error");
    }
    // Adicione outros efeitos automáticos conforme necessário
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-conditions');
    const conditionList = document.getElementById('conditions-list');

    toggleBtn.addEventListener('click', () => {
        conditionList.classList.toggle('show');
    });
});

// Configuração da música de fundo
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    
    // Tentar reproduzir automaticamente
    const playAudio = () => {
        bgMusic.play()
            .then(() => {
                console.log("Música de fundo iniciada");
                bgMusic.volume = 0.3; // Ajuste o volume (0.0 a 1.0)
            })
            .catch(e => {
                console.log("Reprodução automática bloqueada:", e);
                // Requer interação do usuário para iniciar
                document.addEventListener('click', function startAudio() {
                    bgMusic.play();
                    document.removeEventListener('click', startAudio);
                }, { once: true });
            });
    };

    playAudio();
    
    // Impedir que o usuário pause via JavaScript
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        get: function() {
            return false;
        }
    });
});


