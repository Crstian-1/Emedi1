document.addEventListener('DOMContentLoaded', () => {
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
                const curp = curpInput.value;
                const password = passwordInput.value;

                if (curp && password) {
                    alert(`Intentando iniciar sesión con CURP: ${curp} y Contraseña: ${password}`);
                    // Simulación de un login exitoso
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Por favor, ingresa tu CURP y Contraseña.');
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

    // Lógica para la previsualización de la imagen de perfil
    const setupPhotoUpload = () => {
        const uploadPhotoInput = document.getElementById('uploadPhoto');
        const photoPlaceholder = document.querySelector('.profile-photo .photo-placeholder');

        if (uploadPhotoInput && photoPlaceholder) {
            // Asegura que el input de archivo está oculto
            uploadPhotoInput.style.display = 'none';

            uploadPhotoInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Elimina el botón de subir y cualquier imagen previa
                        photoPlaceholder.innerHTML = '';
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = "Foto de perfil"; // Añadir alt text para accesibilidad
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
    // Verificar si estamos en el dashboard.html
    const currentMonthYearDisplay = document.getElementById('currentMonthYear');
    if (currentMonthYearDisplay) { // Si este elemento existe, asumimos que estamos en el dashboard
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        let selectedDate = new Date(); // Por defecto, el día actual

        const calendarGrid = document.getElementById('calendarGrid');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');
        const selectedDateDisplay = document.getElementById('selectedDateDisplay');
        const eventsList = document.getElementById('eventsList');
        const addAppointmentButton = document.getElementById('addAppointmentButton');

        const appointmentModal = document.getElementById('appointmentModal');
        const closeButton = appointmentModal.querySelector('.close-button'); // Ahora es seguro porque appointmentModal ya se verificó
        const appointmentForm = document.getElementById('appointmentForm');
        const appointmentIdInput = document.getElementById('appointmentId');
        const appointmentDateInput = document.getElementById('appointmentDate');
        const appointmentTimeInput = document.getElementById('appointmentTime');
        const appointmentDescriptionInput = document.getElementById('appointmentDescription');
        const deleteAppointmentButton = document.getElementById('deleteAppointmentButton');

        // Cargar citas desde localStorage
        let appointments = JSON.parse(localStorage.getItem('emediAppointments')) || [];

        function saveAppointments() {
            localStorage.setItem('emediAppointments', JSON.stringify(appointments));
        }

        function renderCalendar() {
            calendarGrid.innerHTML = ''; // Limpiar el calendario
            eventsList.innerHTML = ''; // Limpiar la lista de eventos del día

            const date = new Date(currentYear, currentMonth, 1);
            const firstDayOfMonth = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            // Ajustar firstDayOfMonth para que Lunes sea 0
            const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Si es domingo (0), se convierte en 6 (final de la semana), si no, se resta 1

            currentMonthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

            // Días de la semana
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

            // Días del mes anterior (para rellenar el inicio)
            const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
            for (let i = startDay; i > 0; i--) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day', 'prev-month');
                dayDiv.textContent = prevMonthDays - i + 1;
                calendarGrid.appendChild(dayDiv);
            }

            // Días del mes actual
            for (let i = 1; i <= daysInMonth; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day', 'current-month');
                dayDiv.textContent = i;

                const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
                if (dayOfWeek === 0) { // Domingo
                    dayDiv.classList.add('domingo', 'red-text');
                }

                // Marcar el día seleccionado
                if (i === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()) {
                    dayDiv.classList.add('selected');
                }

                // Añadir eventos al día
                const dayAppointments = appointments.filter(app => {
                    const appDate = new Date(app.date);
                    return appDate.getDate() === i && appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
                });

                if (dayAppointments.length > 0) {
                    dayDiv.classList.add('has-event');
                    const eventDot = document.createElement('span');
                    eventDot.classList.add('event-dot', 'blue'); // Color de punto para citas
                    dayDiv.appendChild(eventDot);

                    const eventTooltip = document.createElement('div');
                    eventTooltip.classList.add('event-tooltip');
                    eventTooltip.textContent = dayAppointments.map(app => `${app.time} - ${app.description}`).join('\n');
                    dayDiv.appendChild(eventTooltip);
                }

                // Event listener para seleccionar el día
                dayDiv.addEventListener('click', () => {
                    selectedDate = new Date(currentYear, currentMonth, i);
                    renderCalendar(); // Volver a renderizar para actualizar la selección
                    displayAppointmentsForSelectedDate();
                });

                calendarGrid.appendChild(dayDiv);
            }

            // Días del mes siguiente (para rellenar el final)
            const totalDaysDisplayed = startDay + daysInMonth;
            const remainingCells = 42 - totalDaysDisplayed; // 6 semanas * 7 días
            for (let i = 1; i <= remainingCells; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day', 'next-month');
                dayDiv.textContent = i;
                calendarGrid.appendChild(dayDiv);
            }

            displayAppointmentsForSelectedDate(); // Mostrar citas para el día seleccionado inicialmente
        }

        function displayAppointmentsForSelectedDate() {
            eventsList.innerHTML = '';
            selectedDateDisplay.textContent = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            const dayAppointments = appointments.filter(app => {
                const appDate = new Date(app.date);
                return appDate.getDate() === selectedDate.getDate() &&
                       appDate.getMonth() === selectedDate.getMonth() &&
                       appDate.getFullYear() === selectedDate.getFullYear();
            }).sort((a, b) => a.time.localeCompare(b.time)); // Ordenar por hora

            if (dayAppointments.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No hay citas agendadas para este día.';
                eventsList.appendChild(li);
            } else {
                dayAppointments.forEach(app => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="event-time">${app.time}</span> ${app.description}`;
                    li.dataset.id = app.id; // Guardar el ID de la cita en el elemento LI
                    li.addEventListener('click', () => openAppointmentModal(app)); // Abrir modal para editar
                    eventsList.appendChild(li);
                });
            }
        }

        function openAppointmentModal(appointment = null) {
            appointmentForm.reset();
            deleteAppointmentButton.style.display = 'none';
            appointmentIdInput.value = '';

            if (appointment) {
                // Modo edición
                appointmentModal.querySelector('h2').textContent = 'Editar Cita';
                appointmentIdInput.value = appointment.id;
                appointmentDateInput.value = appointment.date;
                appointmentTimeInput.value = appointment.time;
                appointmentDescriptionInput.value = appointment.description;
                deleteAppointmentButton.style.display = 'block';
            } else {
                // Modo nueva cita
                appointmentModal.querySelector('h2').textContent = 'Agendar Nueva Cita';
                appointmentDateInput.value = selectedDate.toISOString().split('T')[0]; // Establecer la fecha del día seleccionado
            }
            appointmentModal.style.display = 'flex'; // Mostrar el modal
        }

        function closeAppointmentModal() {
            appointmentModal.style.display = 'none';
        }

        // Event Listeners para el calendario
        prevMonthButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });

        nextMonthButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
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
            const id = appointmentIdInput.value || Date.now().toString(); // Generar ID único si es nueva
            const date = appointmentDateInput.value;
            const time = appointmentTimeInput.value;
            const description = appointmentDescriptionInput.value;

            if (!date || !time || !description) {
                alert('Por favor, completa todos los campos de la cita.');
                return;
            }

            const newAppointment = { id, date, time, description };

            if (appointmentIdInput.value) {
                // Editar cita existente
                const index = appointments.findIndex(app => app.id === id);
                if (index !== -1) {
                    appointments[index] = newAppointment;
                }
            } else {
                // Añadir nueva cita
                appointments.push(newAppointment);
            }

            saveAppointments();
            closeAppointmentModal();
            renderCalendar(); // Volver a renderizar para mostrar la cita
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

    // --- Inicialización de funciones generales (login y carga de foto) ---
    handleLogin(); // Inicializa la lógica de login
    setupPhotoUpload(); // Inicializa la lógica de carga de fotos (esto podría ser en ambas páginas si el formulario de datos generales se presentara de alguna forma en login, pero por ahora está bien aquí)

    // Estas funciones ahora se ejecutan fuera del bloque del dashboard para manejar la navegación del sidebar en ambas páginas, si es necesario.
    handleSidebarNavigation(); // Inicializa la navegación del sidebar
    handleSubmenuNavigation(); // Inicializa la navegación del submenú (asociado al sidebar)
});