document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Timer ---
    // GANTI DENGAN TANGGAL ACARA ANDA (YYYY-MM-DDTHH:MM:SS)
    const countdownDateString = "[2025-12-20T09:00:00]"; // Contoh: "2025-12-20T09:00:00"
    const countdownDate = new Date(countdownDateString).getTime();

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");
    const elCountdown = document.getElementById("countdown");

    if (elDays && elHours && elMinutes && elSeconds && elCountdown) {
        const countdownFunction = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance < 0) {
                clearInterval(countdownFunction);
                elCountdown.innerHTML = "<p style='font-size: 1.5rem; font-weight: 500;'>Acara Telah Berlangsung</p>";
                return;
            }

            elDays.innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            elHours.innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            elMinutes.innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            elSeconds.innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
        }, 1000);
    } else {
        console.warn("Elemen countdown tidak ditemukan. Pastikan ID elemen sudah benar.");
    }

    // --- Update Year in Footer ---
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.innerText = new Date().getFullYear();
    }

    // --- Background Music Control ---
    const backgroundMusic = document.getElementById("backgroundMusic");
    const playPauseButton = document.getElementById("playPauseButton");
    const playIconClass = "fa-play";
    const pauseIconClass = "fa-pause";
    let musicPlayedOnce = false; // Untuk mengatasi autoplay yang mungkin diblokir

    if (backgroundMusic && playPauseButton) {
        const playIconElement = playPauseButton.querySelector('i');

        // Fungsi untuk mencoba memainkan musik
        function attemptPlayMusic() {
            if (backgroundMusic.paused && !musicPlayedOnce) {
                backgroundMusic.play()
                    .then(() => {
                        if (playIconElement) {
                            playIconElement.classList.remove(playIconClass);
                            playIconElement.classList.add(pauseIconClass);
                        }
                        musicPlayedOnce = true;
                    })
                    .catch(error => {
                        // Autoplay gagal, tampilkan ikon play
                        if (playIconElement) {
                            playIconElement.classList.remove(pauseIconClass);
                            playIconElement.classList.add(playIconClass);
                        }
                        console.log("Autoplay musik ditolak oleh browser. Menunggu interaksi pengguna.");
                    });
            }
        }

        // Coba mainkan musik saat undangan dibuka (misal, setelah user scroll atau klik)
        // Ini lebih user-friendly daripada autoplay paksa
        function userInteractionListener() {
            attemptPlayMusic();
            // Hapus listener setelah interaksi pertama agar tidak berulang
            window.removeEventListener('scroll', userInteractionListener);
            document.body.removeEventListener('click', userInteractionListener);
        }
        window.addEventListener('scroll', userInteractionListener, { once: true });
        document.body.addEventListener('click', userInteractionListener, { once: true });


        playPauseButton.addEventListener("click", () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                if (playIconElement) {
                    playIconElement.classList.remove(playIconClass);
                    playIconElement.classList.add(pauseIconClass);
                }
                musicPlayedOnce = true;
            } else {
                backgroundMusic.pause();
                if (playIconElement) {
                    playIconElement.classList.remove(pauseIconClass);
                    playIconElement.classList.add(playIconClass);
                }
            }
        });

        // Jika browser mengizinkan, atau jika musik sudah pernah dimainkan sebelumnya (misal: refresh)
        // coba mainkan jika tidak paused (beberapa browser akan melanjutkan state paused)
        if (!backgroundMusic.paused) {
            if (playIconElement) {
                playIconElement.classList.remove(playIconClass);
                playIconElement.classList.add(pauseIconClass);
            }
        }

    } else {
        console.warn("Elemen musik atau tombol play/pause tidak ditemukan.");
    }


    // --- Scroll Reveal Animation for Sections ---
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 15% section terlihat baru animasi
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Hapus komentar jika ingin animasi hanya sekali
            } else {
                // entry.target.classList.remove('visible'); // Tambahkan jika ingin animasi berulang saat scroll keluar viewport
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Smooth scroll untuk tombol panah bawah di hero ---
    const scrollDownButton = document.querySelector('.scroll-down-btn');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
});

// --- Fungsi untuk membuka undangan (opsional, jika ada halaman pembuka) ---
// Anda bisa membuat div dengan id="cover-page" yang menutupi seluruh layar
// dan tombol "Buka Undangan" yang memanggil fungsi ini.
/*
function openInvitation() {
    const coverPage = document.getElementById('cover-page');
    const mainContainer = document.querySelector('.container');
    const audioButton = document.getElementById('playPauseButton');

    if (coverPage) {
        coverPage.style.opacity = '0';
        setTimeout(() => {
            coverPage.style.display = 'none';
        }, 600); // Sesuaikan dengan durasi transisi CSS
    }

    if (mainContainer) {
        // Tampilkan konten utama (mungkin sudah display block by default)
    }

    // Coba putar musik setelah undangan dibuka
    const backgroundMusic = document.getElementById("backgroundMusic");
    const playPauseButton = document.getElementById("playPauseButton");
    const playIconElement = playPauseButton ? playPauseButton.querySelector('i') : null;
    const playIconClass = "fa-play";
    const pauseIconClass = "fa-pause";

    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play()
            .then(() => {
                if (playIconElement) {
                    playIconElement.classList.remove(playIconClass);
                    playIconElement.classList.add(pauseIconClass);
                }
                 if (audioButton) audioButton.style.display = 'flex'; // Tampilkan tombol audio
            })
            .catch(error => {
                console.log("Gagal memutar musik setelah membuka undangan:", error);
                if (audioButton) audioButton.style.display = 'flex'; // Tetap tampilkan tombol audio
            });
    } else if (backgroundMusic && !backgroundMusic.paused) {
        if (audioButton) audioButton.style.display = 'flex';
    }
}

// Contoh jika ada tombol buka undangan:
// const openButton = document.getElementById('open-invitation-button');
// if(openButton) {
//     openButton.addEventListener('click', openInvitation);
//     // Sembunyikan tombol audio awal
//     const audioButton = document.getElementById('playPauseButton');
//     if (audioButton) audioButton.style.display = 'none';
// }
*/
