// Variáveis para controle
        let curseCounter = 5;
        let equipmentCounter = 0;
        
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
    disableEditing(); // Começa bloqueado
    
    // Configurar eventos dos botões
    document.getElementById('edit-btn').addEventListener('click', enableEditing);
    document.getElementById('lock-btn').addEventListener('click', disableEditing);
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
        skills: {
            marksmanship: document.querySelectorAll('.skill-item span:nth-child(2)')[0].textContent,
            fortitude: document.querySelectorAll('.skill-item span:nth-child(2)')[1].textContent,
            fight: document.querySelectorAll('.skill-item span:nth-child(2)')[2].textContent,
            investigation: document.querySelectorAll('.skill-item span:nth-child(2)')[3].textContent,
            perception: document.querySelectorAll('.skill-item span:nth-child(2)')[4].textContent,
            intuition: document.querySelectorAll('.skill-item span:nth-child(2)')[5].textContent,
            intimidation: document.querySelectorAll('.skill-item span:nth-child(2)')[6].textContent,
            deception: document.querySelectorAll('.skill-item span:nth-child(2)')[7].textContent,
            diplomacy: document.querySelectorAll('.skill-item span:nth-child(2)')[8].textContent,
            piloting: document.querySelectorAll('.skill-item span:nth-child(2)')[9].textContent,
            technologies: document.querySelectorAll('.skill-item span:nth-child(2)')[10].textContent,
            instability: document.querySelectorAll('.skill-item span:nth-child(2)')[11].textContent,
            medicine: document.querySelectorAll('.skill-item span:nth-child(2)')[12].textContent,
            paranormal: document.querySelectorAll('.skill-item span:nth-child(2)')[13].textContent,
            climbing: document.querySelectorAll('.skill-item span:nth-child(2)')[14].textContent,
            history: document.querySelectorAll('.skill-item span:nth-child(2)')[15].textContent,
            languages: document.querySelectorAll('.skill-item span:nth-child(2)')[16].textContent,
            will: document.querySelectorAll('.skill-item span:nth-child(2)')[17].textContent,
            stealth: document.querySelectorAll('.skill-item span:nth-child(2)')[18].textContent,
            survival: document.querySelectorAll('.skill-item span:nth-child(2)')[19].textContent,
            athletics: document.querySelectorAll('.skill-item span:nth-child(2)')[20].textContent,
            smithing: document.querySelectorAll('.skill-item span:nth-child(2)')[21].textContent
        },
        
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
            const descriptionElement = curse.querySelector('p:not(.curse-name)');
            
            return {
                name: nameElement ? nameElement.textContent : 'Nova Maldição',
                cost: costElement ? costElement.textContent : '1',
                description: descriptionElement ? descriptionElement.textContent : 'Descrição da maldição.',
                // Captura elemento se existir
                element: curse.querySelector('strong') ? 
                        curse.querySelector('strong').nextSibling.textContent.trim() : ''
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
    const skillElements = document.querySelectorAll('.skill-item span:nth-child(2)');
    skillElements[0].textContent = characterData.skills.marksmanship || '0';
    skillElements[1].textContent = characterData.skills.fortitude || '0';
    skillElements[2].textContent = characterData.skills.fight || '0';
    skillElements[3].textContent = characterData.skills.investigation || '0';
    skillElements[4].textContent = characterData.skills.perception || '0';
    skillElements[5].textContent = characterData.skills.intuition || '0';
    skillElements[6].textContent = characterData.skills.intimidation || '0';
    skillElements[7].textContent = characterData.skills.deception || '0';
    skillElements[8].textContent = characterData.skills.diplomacy || '0';
    skillElements[9].textContent = characterData.skills.piloting || '0';
    skillElements[10].textContent = characterData.skills.technologies || '0';
    skillElements[11].textContent = characterData.skills.instability || '0';
    skillElements[12].textContent = characterData.skills.medicine || '0';
    skillElements[13].textContent = characterData.skills.paranormal || '0';
    skillElements[14].textContent = characterData.skills.climbing || '0';
    skillElements[15].textContent = characterData.skills.history || '0';
    skillElements[16].textContent = characterData.skills.languages || '0';
    skillElements[17].textContent = characterData.skills.will || '0';
    skillElements[18].textContent = characterData.skills.stealth || '0';
    skillElements[19].textContent = characterData.skills.survival || '0';
    skillElements[20].textContent = characterData.skills.athletics || '0';
    skillElements[21].textContent = characterData.skills.smithing || '0';
    
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