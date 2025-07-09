document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM de Login/Registro ---
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const regCurpInput = document.getElementById('reg-curp'); // Cambiado a reg-curp
    const regPasswordInput = document.getElementById('reg-password');
    const regConfirmPasswordInput = document.getElementById('reg-confirm-password');
    const registerButton = document.querySelector('.register-button');

    // --- Funciones para alternar entre Login y Registro ---
    function showLogin() {
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        // Limpiar campos del formulario de registro al volver al login
        regCurpInput.value = '';
        regPasswordInput.value = '';
        regConfirmPasswordInput.value = '';
    }

    function showRegister() {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
        // Limpiar campos del formulario de login al cambiar a registro
        document.getElementById('curp').value = '';
        document.getElementById('password').value = '';
    }

    // --- Event Listeners para alternar vistas ---
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegister();
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    }

    // --- Lógica de Registro de Usuario (Simulado) ---
    if (registerButton) {
        registerButton.addEventListener('click', async () => { // Hacemos la función asíncrona para el SHA-256
            const curp = regCurpInput.value; // Usamos CURP como identificador de usuario
            const password = regPasswordInput.value;
            const confirmPassword = regConfirmPasswordInput.value;

            if (!curp || !password || !confirmPassword) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('emedi_users')) || {};
            if (users[curp]) {
                alert('El CURP ya está registrado. Por favor, inicia sesión o recupera tu cuenta.');
                return;
            }

            // Generar el "estilo codificado" (hash SHA-256) para esta nueva cuenta
            // Usaremos el CURP como base para el estilo si no se pide un estilo específico
            // O podríamos pedir al usuario un "tipo de cuenta" para hashear
            const accountStyle = prompt('Introduce el estilo de tu cuenta (ej. "Premium", "Básico", "Médico", etc.) para generar tu clave hash única:');
            if (!accountStyle) {
                alert('El estilo de cuenta es necesario para generar la clave hash.');
                return;
            }
            const styleHash = await sha256(accountStyle); // Generar hash del estilo

            users[curp] = { password: password, styleHash: styleHash }; // Guardando hash de estilo con la contraseña
            localStorage.setItem('emedi_users', JSON.stringify(users));

            // También guardamos la cuenta blockchain simulada para el display
            const simulatedAddress = '0x' + Math.random().toString(16).substring(2, 10).padStart(8, '0');
            const newBlockchainAccount = {
                address: simulatedAddress,
                username: curp, // El CURP es el nombre de usuario blockchain
                styleHash: styleHash // El hash de estilo generado
            };
            localStorage.setItem('emediBlockchainAccount', JSON.stringify(newBlockchainAccount));

            alert(`¡Registro exitoso! Ahora puedes iniciar sesión.\nTu Clave Hash de Estilo (SHA-256): ${styleHash}`);
            showLogin(); // Volver a la página de login
        });
    }

    /**
     * @function setupInputAnimations
     * @description Configura las animaciones de enfoque y desenfoque para un input dado.
     * @param {HTMLElement} inputElement - El elemento input al que se le aplicarán las animaciones.
     */
    const setupInputAnimations = (inputElement) => {
        if (inputElement) {
            inputElement.addEventListener('focus', () => {
                inputElement.closest('.input-wrapper').style.borderColor = '#007bff';
            });
            inputElement.addEventListener('blur', () => {
                inputElement.closest('.input-wrapper').style.borderColor = 'black';
            });
        }
    };

    /**
     * @function handleLogin
     * @description Maneja la lógica de la página de login, incluyendo validación y redirección.
     */
    const handleLogin = () => {
        const loginButton = document.querySelector('.login-button');
        if (loginButton) { // Solo si estamos en la página de login
            const curpInput = document.getElementById('curp');
            const passwordInput = document.getElementById('password');

            // Configurar animaciones para los inputs de login
            setupInputAnimations(curpInput);
            setupInputAnimations(passwordInput);

            loginButton.addEventListener('click', () => {
                const curp = curpInput.value; // Usado como username para login
                const password = passwordInput.value;

                const users = JSON.parse(localStorage.getItem('emedi_users')) || {};
                if (users[curp] && users[curp].password === password) { // Acceder a la propiedad 'password'
                    alert(`¡Bienvenido, ${curp}!`);
                    window.location.href = 'dashboard.html';
                } else {
                    alert('CURP o Contraseña incorrectos, o usuario no registrado.');
                }
            });
        }
    };

    /**
     * @function handleSidebarNavigation
     * @description Maneja la lógica de navegación del sidebar del dashboard, incluyendo el toggle de submenús.
     */
    const handleSidebarNavigation = () => {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const contentSections = document.querySelectorAll('.content-section');

        sidebarLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetContentId = link.dataset.content + '-content';
                const submenu = link.nextElementSibling; // Intenta obtener el siguiente elemento, que podría ser un submenú
                const arrow = link.querySelector('.arrow');

                // Si el enlace tiene un submenú y ya está activo, ciérralo
                if (submenu && submenu.classList.contains('submenu') && link.classList.contains('active')) {
                    submenu.classList.remove('show');
                    link.classList.remove('active');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                    // Ocultar la sección de contenido asociada si es necesario
                    const targetContent = document.getElementById(targetContentId);
                    if (targetContent) {
                        targetContent.classList.remove('active');
                    }
                    return; // Salir de la función para no reabrirlo
                }

                // Remover clase 'active' de todos los enlaces y ocultar submenús
                sidebarLinks.forEach(item => {
                    item.classList.remove('active');
                    const otherSubmenu = item.nextElementSibling;
                    const otherArrow = item.querySelector('.arrow');

                    if (otherSubmenu && otherSubmenu.classList.contains('submenu')) {
                        otherSubmenu.classList.remove('show');
                        if (otherArrow) {
                            otherArrow.style.transform = 'rotate(0deg)';
                        }
                    }
                });

                // Ocultar todas las secciones de contenido
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });

                // Mostrar la sección de contenido deseada
                const targetContent = document.getElementById(targetContentId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    link.classList.add('active'); // Activar el enlace del sidebar

                    // Si el enlace tiene un submenú, mostrarlo y rotar la flecha
                    if (submenu && submenu.classList.contains('submenu')) {
                        submenu.classList.add('show');
                        if (arrow) {
                            arrow.style.transform = 'rotate(90deg)';
                        }
                    }
                } else {
                    console.warn(`Sección de contenido con ID '${targetContentId}' no encontrada.`);
                }
            });
        });
    };

    /**
     * @function handleSubmenuNavigation
     * @description Maneja la lógica de navegación de los enlaces del submenú de Expediente General.
     */
    const handleSubmenuNavigation = () => {
        const expedienteSubmenuLinks = document.querySelectorAll('#expediente-submenu a');
        const contentSections = document.querySelectorAll('.content-section');

        expedienteSubmenuLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetContentId = link.dataset.content + '-content';

                // Remover clase 'active' de todas las secciones
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });

                // Mostrar la sección de contenido del submenú
                const targetContent = document.getElementById(targetContentId);
                if (targetContent) {
                    targetContent.classList.add('active');
                } else {
                    console.warn(`Sección de contenido de submenú con ID '${targetContentId}' no encontrada.`);
                }
            });
        });
    };

    /**
     * @function activateDefaultDashboardSection
     * @description Activa la sección de calendario por defecto al cargar el dashboard.
     */
    const activateDefaultDashboardSection = () => {
        const defaultActiveLink = document.querySelector('.sidebar-link[data-content="calendar"]');
        if (defaultActiveLink) {
            defaultActiveLink.click();
        }
    };

    // Lógica para la previsualización de la imagen de perfil en el formulario de Datos Generales
    const setupPhotoUpload = () => {
        const uploadPhotoInput = document.getElementById('uploadPhoto');
        const photoPlaceholder = document.querySelector('.profile-photo .photo-placeholder');

        if (uploadPhotoInput && photoPlaceholder) {
            uploadPhotoInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        photoPlaceholder.innerHTML = ''; // Limpia el contenido actual (label)
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = "Foto de perfil";
                        photoPlaceholder.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Permite hacer clic en el placeholder para abrir el selector de archivos
            photoPlaceholder.addEventListener('click', () => {
                uploadPhotoInput.click();
            });
        }
    };


    // --- Lógica del Calendario y Citas (Se ejecutará solo en dashboard.html) ---
    const currentMonthYearDisplay = document.getElementById('currentMonthYear');
    if (currentMonthYearDisplay) {
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        let selectedDate = new Date();
        selectedDate.setHours(0, 0, 0, 0);

        const calendarGrid = document.getElementById('calendarGrid');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');
        const selectedDateDisplay = document.getElementById('selectedDateDisplay');
        const eventsList = document.getElementById('eventsList');
        const addAppointmentButton = document.getElementById('addAppointmentButton');

        const appointmentModal = document.getElementById('appointmentModal');
        const closeButton = appointmentModal.querySelector('.close-button');
        const appointmentForm = document.getElementById('appointmentForm');
        const appointmentIdInput = document.getElementById('appointmentId');
        const appointmentDateInput = document.getElementById('appointmentDate');
        const appointmentTimeInput = document.getElementById('appointmentTime');
        const appointmentDescriptionInput = document.getElementById('appointmentDescription');
        const deleteAppointmentButton = document.getElementById('deleteAppointmentButton');

        let appointments = JSON.parse(localStorage.getItem('emediAppointments')) || [];

        function saveAppointments() {
            localStorage.setItem('emediAppointments', JSON.stringify(appointments));
        }

        function renderCalendar() {
            calendarGrid.innerHTML = ''; // Limpiar el calendario
            // eventsList no se limpia aquí, se limpia en displayAppointmentsForSelectedDate()

            const date = new Date(currentYear, currentMonth, 1);
            const firstDayOfMonth = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Lunes es 0

            currentMonthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

            const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            dayNames.forEach(name => {
                const dayNameDiv = document.createElement('div');
                dayNameDiv.classList.add('day-name');
                if (name === 'Domingo') {
                    dayNameDiv.classList.add('domingo');
                }
                dayNameDiv.textContent = name;
                calendarGrid.appendChild(dayNameDiv);
            });

            const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
            for (let i = startDay; i > 0; i--) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day', 'prev-month');
                dayDiv.textContent = prevMonthDays - i + 1;
                calendarGrid.appendChild(dayDiv);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day', 'current-month');
                dayDiv.textContent = i;

                const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
                if (dayOfWeek === 0) { // Domingo
                    dayDiv.classList.add('domingo', 'red-text');
                }

                const currentDayInLoop = new Date(currentYear, currentMonth, i);
                currentDayInLoop.setHours(0, 0, 0, 0); // Normaliza a medianoche local

                const normalizedSelectedDate = new Date(selectedDate);
                normalizedSelectedDate.setHours(0, 0, 0, 0);

                if (currentDayInLoop.getTime() === normalizedSelectedDate.getTime()) {
                    dayDiv.classList.add('selected');
                }

                const dayAppointments = appointments.filter(app => {
                    const appDateParts = app.date.split('-').map(Number);
                    const appDate = new Date(appDateParts[0], appDateParts[1] - 1, appDateParts[2]);
                    appDate.setHours(0, 0, 0, 0);
                    return appDate.getTime() === currentDayInLoop.getTime();
                });

                if (dayAppointments.length > 0) {
                    dayDiv.classList.add('has-event');
                    const eventDot = document.createElement('span');
                    eventDot.classList.add('event-dot', 'blue');
                    dayDiv.appendChild(eventDot);

                    const eventTooltip = document.createElement('div');
                    eventTooltip.classList.add('event-tooltip');
                    eventTooltip.textContent = dayAppointments.map(app => `${app.time} - ${app.description}`).join('\n');
                    dayDiv.appendChild(eventTooltip);
                }

                dayDiv.addEventListener('click', () => {
                    selectedDate = new Date(currentYear, currentMonth, i);
                    selectedDate.setHours(0, 0, 0, 0);
                    renderCalendar();
                    displayAppointmentsForSelectedDate();
                });

                calendarGrid.appendChild(dayDiv);
            }

            const totalDaysDisplayed = startDay + daysInMonth;
            const remainingCells = 42 - totalDaysDisplayed; // 6 semanas * 7 días
            for (let i = 1; i <= remainingCells; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day', 'next-month');
                dayDiv.textContent = i;
                calendarGrid.appendChild(dayDiv);
            }

            displayAppointmentsForSelectedDate();
        }

        function displayAppointmentsForSelectedDate() {
            eventsList.innerHTML = '';
            selectedDateDisplay.textContent = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            const dayAppointments = appointments.filter(app => {
                const appDateParts = app.date.split('-').map(Number);
                const appDate = new Date(appDateParts[0], appDateParts[1] - 1, appDateParts[2]);
                appDate.setHours(0, 0, 0, 0);

                const normalizedSelectedDate = new Date(selectedDate);
                normalizedSelectedDate.setHours(0, 0, 0, 0);

                return appDate.getTime() === normalizedSelectedDate.getTime();
            }).sort((a, b) => a.time.localeCompare(b.time));

            if (dayAppointments.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No hay citas agendadas para este día.';
                eventsList.appendChild(li);
            } else {
                dayAppointments.forEach(app => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="event-time">${app.time}</span> ${app.description}`;
                    li.dataset.id = app.id;
                    li.addEventListener('click', () => openAppointmentModal(app));
                    eventsList.appendChild(li);
                });
            }
        }

        function openAppointmentModal(appointment = null) {
            appointmentForm.reset();
            deleteAppointmentButton.style.display = 'none';
            appointmentIdInput.value = '';

            if (appointment) {
                appointmentModal.querySelector('h2').textContent = 'Editar Cita';
                appointmentIdInput.value = appointment.id;
                appointmentDateInput.value = appointment.date;
                appointmentTimeInput.value = appointment.time;
                appointmentDescriptionInput.value = appointment.description;
                deleteAppointmentButton.style.display = 'block';
            } else {
                appointmentModal.querySelector('h2').textContent = 'Agendar Nueva Cita';
                const year = selectedDate.getFullYear();
                const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                const day = selectedDate.getDate().toString().padStart(2, '0');
                appointmentDateInput.value = `${year}-${month}-${day}`;
            }
            appointmentModal.classList.add('show-modal'); // Usar clase para mostrar
        }

        function closeAppointmentModal() {
            appointmentModal.classList.remove('show-modal'); // Usar clase para ocultar
        }

        prevMonthButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            selectedDate = new Date(currentYear, currentMonth, 1);
            selectedDate.setHours(0, 0, 0, 0);
            renderCalendar();
        });

        nextMonthButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            selectedDate = new Date(currentYear, currentMonth, 1);
            selectedDate.setHours(0, 0, 0, 0);
            renderCalendar();
        });

        addAppointmentButton.addEventListener('click', () => openAppointmentModal());
        closeButton.addEventListener('click', closeAppointmentModal);
        window.addEventListener('click', (event) => {
            if (event.target === appointmentModal) {
                closeAppointmentModal();
            }
        });

        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const id = appointmentIdInput.value || Date.now().toString();
            const date = appointmentDateInput.value;
            const time = appointmentTimeInput.value;
            const description = appointmentDescriptionInput.value;

            if (!date || !time || !description) {
                alert('Por favor, completa todos los campos de la cita.');
                return;
            }

            const newAppointment = { id, date, time, description };

            if (appointmentIdInput.value) {
                const index = appointments.findIndex(app => app.id === id);
                if (index !== -1) {
                    appointments[index] = newAppointment;
                }
            } else {
                appointments.push(newAppointment);
            }

            saveAppointments();
            closeAppointmentModal();
            renderCalendar();
        });

        deleteAppointmentButton.addEventListener('click', () => {
            const idToDelete = appointmentIdInput.value;
            if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
                appointments = appointments.filter(app => app.id !== idToDelete);
                saveAppointments();
                closeAppointmentModal();
                renderCalendar();
            }
        });

        renderCalendar(); // Renderiza el calendario al cargar el dashboard
        activateDefaultDashboardSection(); // Activa la sección por defecto del dashboard
    }


    // --- Lógica para guardar y mostrar Datos Generales ---
    const datosGeneralesForm = document.getElementById('datos-generales-form');
    const datosRegistradosDiv = document.getElementById('datos-registrados');
    const editDatosButton = document.getElementById('editDatosButton');

    // Mapeo de IDs de input a IDs de display span
    const datosMap = {
        nombreCompletoForm: 'display-nombreCompleto',
        curpGeneralForm: 'display-curpGeneral',
        fechaNacimientoForm: 'display-fechaNacimiento',
        grupoSanguineoForm: 'display-grupoSanguineo',
        edadForm: 'display-edad',
        sexoForm: 'display-sexo',
        padecimientosGeneralesForm: 'display-padecimientosGenerales'
    };

    function loadAndDisplayDatosGenerales() {
        const storedData = JSON.parse(localStorage.getItem('emediDatosGenerales'));
        const storedPhoto = localStorage.getItem('emediProfilePhoto');
        const isDataStored = storedData && Object.values(storedData).some(val => val) || storedPhoto;

        if (isDataStored) {
            datosRegistradosDiv.classList.remove('hidden');
            datosGeneralesForm.classList.add('hidden');

            for (const key in datosMap) {
                const displaySpan = document.getElementById(datosMap[key]);
                if (displaySpan) {
                    displaySpan.textContent = (storedData && storedData[key]) ? storedData[key] : 'N/A';
                }
                const inputElement = document.getElementById(key);
                if (inputElement) {
                    inputElement.value = (storedData && storedData[key]) ? storedData[key] : '';
                }
            }

            const displayPhotoPlaceholder = document.getElementById('display-profilePhoto');
            if (displayPhotoPlaceholder) {
                if (storedPhoto) {
                    displayPhotoPlaceholder.innerHTML = `<img src="${storedPhoto}" alt="Foto de Perfil Registrada">`;
                } else {
                    displayPhotoPlaceholder.innerHTML = `<span>No hay foto cargada</span>`;
                }
            }
            const formPhotoPlaceholder = document.querySelector('.profile-photo .photo-placeholder');
            if (formPhotoPlaceholder) {
                if (storedPhoto) {
                    formPhotoPlaceholder.innerHTML = `<img src="${storedPhoto}" alt="Foto de Perfil">`;
                } else {
                    formPhotoPlaceholder.innerHTML = `<label for="uploadPhoto">Subir Foto</label><input type="file" id="uploadPhoto" name="uploadPhoto" accept="image/*" style="display: none;">`;
                    const newUploadInput = document.getElementById('uploadPhoto');
                    if(newUploadInput) {
                        newUploadInput.addEventListener('change', function(event) {
                            const file = event.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    formPhotoPlaceholder.innerHTML = '';
                                    const img = document.createElement('img');
                                    img.src = e.target.result;
                                    img.alt = "Foto de perfil";
                                    formPhotoPlaceholder.appendChild(img);
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    }
                }
            }


        } else {
            datosRegistradosDiv.classList.add('hidden');
            datosGeneralesForm.classList.remove('hidden');
        }
    }

    function saveDatosGenerales() {
        const dataToSave = {};
        for (const key in datosMap) {
            const inputElement = document.getElementById(key);
            if (inputElement) {
                dataToSave[key] = inputElement.value;
            }
        }

        const uploadPhotoInput = document.getElementById('uploadPhoto');
        if (uploadPhotoInput && uploadPhotoInput.files[0]) {
            const file = uploadPhotoInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('emediProfilePhoto', e.target.result);
                localStorage.setItem('emediDatosGenerales', JSON.stringify(dataToSave));
                loadAndDisplayDatosGenerales();
            };
            reader.readAsDataURL(file);
        } else {
            localStorage.setItem('emediDatosGenerales', JSON.stringify(dataToSave));
            loadAndDisplayDatosGenerales();
        }
    }


    if (datosGeneralesForm) { // Solo si estamos en una página con el formulario de datos generales
        datosGeneralesForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveDatosGenerales();
            alert('Datos generales guardados exitosamente.');
        });

        editDatosButton.addEventListener('click', () => {
            datosRegistradosDiv.classList.add('hidden');
            datosGeneralesForm.classList.remove('hidden');
            setupPhotoUpload(); // Re-adjuntar listener para la foto si se re-renderiza el input
        });

        loadAndDisplayDatosGenerales();
    }

    // --- Lógica para Ficha de Emergencia editable con contraseña ---
    const emergencyDataDisplay = document.getElementById('emergency-data-display');
    const emergencyDataForm = document.getElementById('emergency-data-form');
    const editEmergencyButton = document.getElementById('editEmergencyButton');

    // Contraseña de edición (SOLO PARA DEMOSTRACIÓN - NO SEGURO EN PRODUCCIÓN)
    const EDIT_PASSWORD = 'emedi123'; 

    // Mapeo de IDs de input a IDs de display span para Ficha de Emergencia
    const emergencyDatosMap = {
        emPatientNameForm: 'em-patient-name-display',
        emPatientDobForm: 'em-patient-dob-display',
        emCurpForm: 'em-curp-display',
        emBloodTypeForm: 'em-blood-type-display',
        emAllergiesForm: 'em-allergies-display',
        emChronicConditionsForm: 'em-chronic-conditions-display',
        emCurrentMedsForm: 'em-current-meds-display',
        emMedicalDevicesForm: 'em-medical-devices-display',
        emContactNameForm: 'em-contact-name-display',
        emContactPhoneForm: 'em-contact-phone-display',
        emContactRelationForm: 'em-contact-relation-display'
    };

    function loadAndDisplayEmergencyData() {
        const storedEmergencyData = JSON.parse(localStorage.getItem('emediEmergencyData'));
        const isEmergencyDataStored = storedEmergencyData && Object.values(storedEmergencyData).some(val => val);

        if (isEmergencyDataStored) {
            emergencyDataDisplay.classList.remove('hidden');
            emergencyDataForm.classList.add('hidden');

            for (const key in emergencyDatosMap) {
                const displaySpan = document.getElementById(emergencyDatosMap[key]);
                if (displaySpan) {
                    displaySpan.textContent = (storedEmergencyData && storedEmergencyData[key]) ? storedEmergencyData[key] : 'N/A';
                }
                const inputElement = document.getElementById(key);
                if (inputElement) {
                    inputElement.value = (storedEmergencyData && storedEmergencyData[key]) ? storedEmergencyData[key] : '';
                }
            }
        } else {
            // Si no hay datos guardados, mostrar el formulario para que el usuario pueda llenarlo
            emergencyDataDisplay.classList.add('hidden');
            emergencyDataForm.classList.remove('hidden');
        }
    }

    function saveEmergencyData() {
        const dataToSave = {};
        for (const key in emergencyDatosMap) {
            const inputElement = document.getElementById(key);
            if (inputElement) {
                dataToSave[key] = inputElement.value;
            }
        }
        localStorage.setItem('emediEmergencyData', JSON.stringify(dataToSave));
        loadAndDisplayEmergencyData();
    }

    if (emergencyDataForm) { // Solo si estamos en la página con la ficha de emergencia
        emergencyDataForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveEmergencyData();
            alert('Ficha de Emergencia guardada exitosamente.');
        });

        editEmergencyButton.addEventListener('click', () => {
            const enteredPassword = prompt('Introduce la contraseña para editar la Ficha de Emergencia:');
            if (enteredPassword === EDIT_PASSWORD) {
                emergencyDataDisplay.classList.add('hidden');
                emergencyDataForm.classList.remove('hidden');
            } else {
                alert('Contraseña incorrecta. No se puede editar la ficha.');
            }
        });

        loadAndDisplayEmergencyData(); // Cargar y mostrar datos al inicio
    }

    // --- Lógica para Mi Cuenta Blockchain ---
    const registerBlockchainAccountButton = document.getElementById('registerBlockchainAccountButton');
    const unlockBlockchainAccountButton = document.getElementById('unlockBlockchainAccountButton');
    const displayBlockchainAddress = document.getElementById('display-blockchain-address');
    const displayBlockchainUsername = document.getElementById('display-blockchain-username');
    const displayBlockchainStyleHash = document.getElementById('display-blockchain-style-hash');
    const blockchainStatus = document.getElementById('blockchain-status');

    // Función de hashing SHA-256 (simulada para navegador)
    // ¡ADVERTENCIA! NO USAR PARA SEGURIDAD CRÍTICA EN PRODUCCIÓN SIN CUIDADO.
    async function sha256(message) {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hexHash;
    }

    async function loadBlockchainAccount() {
        const storedAccount = JSON.parse(localStorage.getItem('emediBlockchainAccount'));
        if (storedAccount) {
            displayBlockchainAddress.textContent = storedAccount.address;
            displayBlockchainUsername.textContent = storedAccount.username; // Será el CURP
            displayBlockchainStyleHash.textContent = storedAccount.styleHash;
            blockchainStatus.textContent = 'Registrada';
            blockchainStatus.style.backgroundColor = '#d4edda';
            blockchainStatus.style.color = '#155724';
            unlockBlockchainAccountButton.classList.remove('hidden');
            registerBlockchainAccountButton.textContent = 'Actualizar Cuenta Blockchain';
        } else {
            displayBlockchainAddress.textContent = 'N/A';
            displayBlockchainUsername.textContent = 'N/A';
            displayBlockchainStyleHash.textContent = 'N/A';
            blockchainStatus.textContent = 'No registrada';
            blockchainStatus.style.backgroundColor = '#f8d7da';
            blockchainStatus.style.color = '#721c24';
            unlockBlockchainAccountButton.classList.add('hidden');
            registerBlockchainAccountButton.textContent = 'Registrar Nueva Cuenta Blockchain';
        }
    }

    if (registerBlockchainAccountButton) { // Solo si estamos en la sección de cuenta blockchain
        registerBlockchainAccountButton.addEventListener('click', async () => {
            const curpFromLoginForm = document.getElementById('curp').value; // Intentar obtener CURP del formulario de login
            const curpFromGeneralData = document.getElementById('display-curpGeneral') ? document.getElementById('display-curpGeneral').textContent : ''; // O de datos generales

            let curpToUse = curpFromLoginForm || curpFromGeneralData;

            if (curpToUse === 'N/A' || !curpToUse) {
                curpToUse = prompt('Introduce el CURP del usuario para asociar a la cuenta Blockchain:');
                if (!curpToUse) {
                    alert('El CURP es necesario para registrar la cuenta Blockchain.');
                    return;
                }
            }
            
            const accountStyle = prompt('Introduce el estilo de tu cuenta (ej. "Premium", "Básico", "Médico", etc.) para generar tu clave hash única:');
            if (!accountStyle) {
                alert('El estilo de cuenta es necesario para generar la clave hash.');
                return;
            }

            const styleHash = await sha256(accountStyle); // Generar hash del estilo

            // Simular generación de dirección de cuenta (una aleatoria corta)
            const simulatedAddress = '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0'); // Más larga para simular dirección real

            const newAccount = {
                address: simulatedAddress,
                username: curpToUse, // Usar el CURP como nombre de usuario blockchain
                styleHash: styleHash
            };

            localStorage.setItem('emediBlockchainAccount', JSON.stringify(newAccount));
            alert(`¡Cuenta Blockchain registrada/actualizada con éxito!\n\nTu CURP de cuenta: ${curpToUse}\nTu Estilo Codificado (Clave Hash SHA-256): ${styleHash}`);
            
            loadBlockchainAccount(); // Recargar la información en la pantalla
        });

        unlockBlockchainAccountButton.addEventListener('click', () => {
            const storedAccount = JSON.parse(localStorage.getItem('emediBlockchainAccount'));
            if (!storedAccount) {
                alert('No hay cuenta blockchain registrada.');
                return;
            }
            const password = prompt('Introduce tu contraseña para desbloquear tu cuenta blockchain (cualquier texto para simulación):');
            if (password) { // Simplemente aceptar cualquier contraseña como "correcta" para la simulación
                alert('¡Cuenta Blockchain desbloqueada!\n' +
                      'Dirección: ' + storedAccount.address + '\n' +
                      'CURP: ' + storedAccount.username + '\n' +
                      'Estilo Codificado: ' + storedAccount.styleHash);
            } else {
                alert('Desbloqueo cancelado.');
            }
        });

        loadBlockchainAccount(); // Cargar la cuenta blockchain al inicio de la sección
    }


    // --- Inicialización de funciones generales ---
    handleLogin();
    setupInputAnimations(regCurpInput); // Animaciones para campos de registro (ahora CURP)
    setupInputAnimations(regPasswordInput);
    setupInputAnimations(regConfirmPasswordInput);

    // Estas funciones son específicas del dashboard, pero el script.js se carga en ambas.
    // Su inicialización debe estar dentro de la verificación del elemento del dashboard, como ya está.
    setupPhotoUpload();
    handleSidebarNavigation();
    handleSubmenuNavigation();
});