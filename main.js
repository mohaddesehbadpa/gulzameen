/**
 * Gulzameen (Balochistan) - Cultural Heritage Website
 * Main JavaScript Module
 *
 * Provides animations, scroll effects, interactive elements,
 * map popup functionality, utility helpers, keyboard navigation,
 * and audio player handling for the cultural heritage platform.
 */

// ============================================================
// 1. Initialization on DOMContentLoaded
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    initializeAnimations();
    initializeScrollEffects();
    initializeInteractiveElements();
});

// ============================================================
// 2. Animation System
// ============================================================

/**
 * Sets up an Intersection Observer that triggers fade-in
 * animations when observed elements scroll into view.
 */
function initializeAnimations() {
    // Define the selectors for all animatable elements
    var animatedSelectors = [
        '.treasure-card',
        '.region-card',
        '.contribution-item',
        '.story-card',
        '.song-card',
        '.pattern-card',
        '.mission-card',
        '.user-stat'
    ];

    // Configure the observer with a visibility threshold
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                // Stop observing once the animation has fired
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Collect all matching elements and begin observing them
    var targets = document.querySelectorAll(animatedSelectors.join(', '));
    targets.forEach(function (el) {
        el.classList.add('fade-in-hidden');
        fadeObserver.observe(el);
    });

    // Inject the minimal CSS rules needed for the fade transition
    injectAnimationStyles();
}

/**
 * Injects a <style> block with the CSS classes used by the
 * Intersection Observer fade-in animation system.
 */
function injectAnimationStyles() {
    var style = document.createElement('style');
    style.textContent =
        '.fade-in-hidden {' +
        '  opacity: 0;' +
        '  transform: translateY(30px);' +
        '  transition: opacity 0.6s ease-out, transform 0.6s ease-out;' +
        '}' +
        '.fade-in-visible {' +
        '  opacity: 1;' +
        '  transform: translateY(0);' +
        '}' +
        '.ripple {' +
        '  position: absolute;' +
        '  border-radius: 50%;' +
        '  background: rgba(255, 255, 255, 0.4);' +
        '  transform: scale(0);' +
        '  animation: ripple-expand 0.6s ease-out;' +
        '  pointer-events: none;' +
        '}' +
        '@keyframes ripple-expand {' +
        '  to { transform: scale(4); opacity: 0; }' +
        '}' +
        '.toast-notification {' +
        '  position: fixed;' +
        '  bottom: 30px;' +
        '  right: 30px;' +
        '  background: #2d6a4f;' +
        '  color: #fff;' +
        '  padding: 14px 28px;' +
        '  border-radius: 8px;' +
        '  font-size: 15px;' +
        '  box-shadow: 0 4px 12px rgba(0,0,0,0.25);' +
        '  opacity: 0;' +
        '  transform: translateY(20px);' +
        '  transition: opacity 0.35s ease, transform 0.35s ease;' +
        '  z-index: 10000;' +
        '}' +
        '.toast-notification.visible {' +
        '  opacity: 1;' +
        '  transform: translateY(0);' +
        '}';
    document.head.appendChild(style);
}

// ============================================================
// 3. Scroll Effects
// ============================================================

/**
 * Registers scroll-driven effects: parallax on the hero section
 * and a drop-shadow on the navbar once the user scrolls down.
 */
function initializeScrollEffects() {
    var hero = document.querySelector('.hero');
    var navbar = document.querySelector('.navbar');

    // Throttle flag to limit work per animation frame
    var ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var scrollY = window.pageYOffset;

                // Parallax: shift hero background at half the scroll speed
                if (hero) {
                    hero.style.backgroundPositionY = -(scrollY * 0.5) + 'px';
                }

                // Navbar shadow appears after scrolling 50 px
                if (navbar) {
                    if (scrollY > 50) {
                        navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
                    } else {
                        navbar.style.boxShadow = 'none';
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================================
// 4. Interactive Elements
// ============================================================

/**
 * Wires up smooth-scrolling anchor links and play-button toggle
 * behaviour throughout the page.
 */
function initializeInteractiveElements() {
    // --- Smooth scrolling for same-page anchor links ---
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return; // bare hash, nothing to scroll to

            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Play / Pause button toggle ---
    var playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var icon = this.querySelector('i');
            if (!icon) return;

            var isPlaying = icon.classList.contains('fa-pause');
            if (isPlaying) {
                // Switch back to play icon
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            } else {
                // Switch to pause icon
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }
        });
    });

    // --- Count-up animation for any elements bearing data-count ---
    var countElements = document.querySelectorAll('[data-count]');
    if (countElements.length > 0) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var target = parseInt(entry.target.getAttribute('data-count'), 10);
                    animateCountUp(entry.target, target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(function (el) {
            countObserver.observe(el);
        });
    }
}

// ============================================================
// 5. Map Popup Functions (global scope)
// ============================================================

/**
 * Region metadata used by the map popup overlay.
 */
var regionData = {
    eastern: {
        name: 'Baloch of Eastern Region',
        desc: 'Eastern Baloch traditions...'
    },
    western: {
        name: 'Baloch of Western Region',
        desc: 'Western highland customs...'
    },
    southern: {
        name: 'Baloch of Southern Region',
        desc: 'Southern coastal and plain customs...'
    }
};

/**
 * Displays the map information popup with details for the
 * specified region key (eastern | western | southern).
 *
 * @param {string} region - Key into the regionData object.
 */
window.showMapPopup = function (region) {
    var popup = document.getElementById('mapInfoPopup');
    if (!popup) return;

    var info = regionData[region];
    if (!info) return;

    // Populate the popup content
    var nameEl = popup.querySelector('.popup-region-name');
    var descEl = popup.querySelector('.popup-region-desc');

    if (nameEl) nameEl.textContent = info.name;
    if (descEl) descEl.textContent = info.desc;

    // Store the current region for the "Go to region" button
    popup.setAttribute('data-region', region);

    // Make the popup visible
    popup.style.display = 'flex';
};

/**
 * Hides the map information popup.
 */
window.closeMapPopup = function () {
    var popup = document.getElementById('mapInfoPopup');
    if (popup) {
        popup.style.display = 'none';
    }
};

/**
 * Navigates the browser to the dedicated region page.
 *
 * @param {string} region - Region key used in the URL path.
 */
window.goToRegion = function (region) {
    if (region) {
        window.location.href = '/region/' + region;
    }
};

// ============================================================
// 6. Utility Functions
// ============================================================

/**
 * Shows a temporary toast notification at the bottom-right of
 * the viewport. The message auto-dismisses after 3 seconds.
 *
 * @param {string} message - The text to display.
 */
function showNotification(message) {
    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow so the transition plays from opacity 0
    void toast.offsetWidth;
    toast.classList.add('visible');

    // Begin fade-out after 3 seconds, then remove from DOM
    setTimeout(function () {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }, 3000);
}

/**
 * Animates a numeric value inside an element from 0 up to
 * the given target over roughly 2 seconds using ease-out.
 *
 * @param {HTMLElement} element - The element whose textContent
 *                                will be updated each frame.
 * @param {number}      target  - The final number to reach.
 */
function animateCountUp(element, target) {
    var duration = 2000; // milliseconds
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);

        // Ease-out quad curve for a natural deceleration feel
        var easedProgress = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(easedProgress * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Guarantee the final value is exact
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(step);
}

/**
 * Attaches a Material-Design-style ripple effect to the given
 * element. Each click spawns a circular ripple that expands
 * and fades out.
 *
 * @param {HTMLElement} element - The element to enhance.
 */
function addRippleEffect(element) {
    // The element needs relative or absolute positioning for
    // the absolutely-positioned ripple span to work correctly.
    var position = window.getComputedStyle(element).position;
    if (position !== 'relative' && position !== 'absolute') {
        element.style.position = 'relative';
    }
    element.style.overflow = 'hidden';

    element.addEventListener('click', function (e) {
        var rect = element.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);

        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        element.appendChild(ripple);

        // Clean up the ripple span after animation completes
        ripple.addEventListener('animationend', function () {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        });
    });
}

// ============================================================
// 7. Keyboard Navigation
// ============================================================

/**
 * Global keydown listener. Currently handles:
 *  - Escape: close the map popup if it is open.
 */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        window.closeMapPopup();
    }
});

// ============================================================
// 8. Audio Player Handling (region pages)
// ============================================================

/**
 * Initialises lightweight audio players on region pages.
 * Looks for <audio> elements and their companion play buttons
 * (.audio-play-btn), wiring up play/pause toggling, progress
 * tracking, and time display.
 *
 * Runs on DOMContentLoaded so it safely queries the DOM.
 */
document.addEventListener('DOMContentLoaded', function () {
    var audioPlayers = document.querySelectorAll('audio');
    if (audioPlayers.length === 0) return;

    audioPlayers.forEach(function (audio) {
        var container = audio.closest('.audio-player');
        if (!container) return;

        var playBtn = container.querySelector('.audio-play-btn');
        var progressBar = container.querySelector('.audio-progress');
        var currentTimeEl = container.querySelector('.audio-current-time');
        var durationEl = container.querySelector('.audio-duration');

        // Toggle play / pause when the button is clicked
        if (playBtn) {
            playBtn.addEventListener('click', function () {
                if (audio.paused) {
                    // Pause every other player before starting this one
                    pauseAllAudioExcept(audio);
                    audio.play();
                    playBtn.classList.add('playing');
                    updatePlayBtnIcon(playBtn, true);
                } else {
                    audio.pause();
                    playBtn.classList.remove('playing');
                    updatePlayBtnIcon(playBtn, false);
                }
            });
        }

        // Update progress bar and current time as audio plays
        audio.addEventListener('timeupdate', function () {
            if (progressBar && audio.duration) {
                var pct = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = pct + '%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(audio.currentTime);
            }
        });

        // Display the total duration once metadata is available
        audio.addEventListener('loadedmetadata', function () {
            if (durationEl) {
                durationEl.textContent = formatTime(audio.duration);
            }
        });

        // Reset the button when playback reaches the end
        audio.addEventListener('ended', function () {
            if (playBtn) {
                playBtn.classList.remove('playing');
                updatePlayBtnIcon(playBtn, false);
            }
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
    });
});

// ============================================================
// 8. Dynamic Content Loading
// ============================================================

/**
 * Loads dynamic stats from the API and updates the homepage counters
 */
function loadDynamicStats() {
    fetch('/api/stats')
        .then(function(response) {
            return response.json();
        })
        .then(function(stats) {
            // Update the stat counters
            var folkStoriesEl = document.getElementById('folkStoriesCount');
            var traditionalSongsEl = document.getElementById('traditionalSongsCount');
            var patternDesignsEl = document.getElementById('patternDesignsCount');
            var regionsEl = document.getElementById('regionsCount');

            if (folkStoriesEl) {
                animateCounter(folkStoriesEl, 0, stats.folk_stories);
            }
            if (traditionalSongsEl) {
                animateCounter(traditionalSongsEl, 0, stats.traditional_songs);
            }
            if (patternDesignsEl) {
                animateCounter(patternDesignsEl, 0, stats.pattern_designs);
            }
            if (regionsEl) {
                animateCounter(regionsEl, 0, stats.regions);
            }
        })
        .catch(function(error) {
            console.log('Could not load stats:', error);
        });
}

/**
 * Loads recent contributions from the API and displays them
 */
function loadRecentContributions() {
    fetch('/api/collaborate')
        .then(function(response) {
            return response.json();
        })
        .then(function(contributions) {
            var grid = document.getElementById('contributionsGrid');
            var placeholder = document.getElementById('contributionPlaceholder');

            if (!grid) return;

            // Clear existing content except placeholder
            var existingItems = grid.querySelectorAll('.contribution-item');
            existingItems.forEach(function(item) {
                item.remove();
            });

            if (contributions.length === 0) {
                // Show placeholder if no contributions
                if (placeholder) {
                    placeholder.style.display = 'block';
                }
                return;
            }

            // Hide placeholder
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Add contribution items
            contributions.slice(0, 6).forEach(function(contribution) {
                var item = createContributionItem(contribution);
                grid.insertBefore(item, placeholder);
            });
        })
        .catch(function(error) {
            console.log('Could not load contributions:', error);
        });
}

/**
 * Creates a contribution item element from contribution data
 */
function createContributionItem(contribution) {
    var item = document.createElement('div');
    item.className = 'contribution-item';

    // Avatar
    var avatar = document.createElement('div');
    avatar.className = 'contribution-avatar';
    avatar.innerHTML = '<i class="fas fa-user"></i>';
    item.appendChild(avatar);

    // Info section
    var info = document.createElement('div');
    info.className = 'contribution-info';

    var title = document.createElement('h4');
    title.textContent = contribution.category || 'Contribution';
    info.appendChild(title);

    var author = document.createElement('p');
    author.className = 'contribution-author';
    author.textContent = 'By ' + (contribution.name || 'Anonymous');
    info.appendChild(author);

    var text = document.createElement('p');
    text.className = 'contribution-text';
    var contentPreview = contribution.content || '';
    if (contentPreview.length > 80) {
        contentPreview = contentPreview.substring(0, 80) + '...';
    }
    text.textContent = contentPreview;
    info.appendChild(text);

    var time = document.createElement('span');
    time.className = 'contribution-time';
    time.textContent = getTimeAgo(contribution.timestamp);
    info.appendChild(time);

    item.appendChild(info);

    // Badge
    var badge = document.createElement('div');
    badge.className = 'contribution-badge ' + getBadgeClass(contribution.category);
    var icon = document.createElement('i');
    icon.className = getBadgeIcon(contribution.category);
    badge.appendChild(icon);
    item.appendChild(badge);

    return item;
}

/**
 * Gets the appropriate badge class for a contribution category
 */
function getBadgeClass(category) {
    var classes = {
        'Folk Story': '',
        'Traditional Song': 'music',
        'Recipe': 'recipe',
        'Melody (Saoth)': 'music',
        'Quiz': '',
        'Cultural Treasure (Bathal)': 'pattern',
        'Activity': 'pattern'
    };
    return classes[category] || '';
}

/**
 * Gets the appropriate badge icon for a contribution category
 */
function getBadgeIcon(category) {
    var icons = {
        'Folk Story': 'fas fa-book-open',
        'Traditional Song': 'fas fa-music',
        'Recipe': 'fas fa-utensils',
        'Melody (Saoth)': 'fas fa-music',
        'Quiz': 'fas fa-question-circle',
        'Cultural Treasure (Bathal)': 'fas fa-palette',
        'Activity': 'fas fa-palette'
    };
    return icons[category] || 'fas fa-plus';
}

/**
 * Converts a timestamp to a "time ago" string
 */
function getTimeAgo(timestampStr) {
    try {
        var timestamp = new Date(timestampStr.replace(' UTC', ''));
        var now = new Date();
        var diffMs = now - timestamp;
        var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        var diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
            return 'Less than an hour ago';
        } else if (diffHours < 24) {
            return diffHours + ' hour' + (diffHours !== 1 ? 's' : '') + ' ago';
        } else {
            return diffDays + ' day' + (diffDays !== 1 ? 's' : '') + ' ago';
        }
    } catch (e) {
        return 'Recently';
    }
}

// Load dynamic content when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are ready
    setTimeout(function() {
        // Load stats and contributions if we're on the homepage
        if (document.getElementById('contributionsGrid') && document.getElementById('contributionPlaceholder')) {
            loadRecentContributions();
        }
        if (document.getElementById('folkStoriesCount')) {
            loadDynamicStats();
        }
    }, 100);
});

/**
 * Pauses every <audio> element on the page except the one
 * that is about to start playing, and resets their buttons.
 *
 * @param {HTMLAudioElement} exceptAudio - The audio to skip.
 */
function pauseAllAudioExcept(exceptAudio) {
    var allAudio = document.querySelectorAll('audio');
    allAudio.forEach(function (a) {
        if (a !== exceptAudio && !a.paused) {
            a.pause();
            var container = a.closest('.audio-player');
            if (container) {
                var btn = container.querySelector('.audio-play-btn');
                if (btn) {
                    btn.classList.remove('playing');
                    updatePlayBtnIcon(btn, false);
                }
            }
        }
    });
}

/**
 * Swaps the play/pause icon inside a button element.
 *
 * @param {HTMLElement} btn       - The button containing an <i> icon.
 * @param {boolean}     isPlaying - Whether the audio is now playing.
 */
function updatePlayBtnIcon(btn, isPlaying) {
    var icon = btn.querySelector('i');
    if (!icon) return;

    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

/**
 * Converts a time value in seconds to an "m:ss" string.
 *
 * @param  {number} seconds - Time in seconds.
 * @return {string}         - Formatted time string.
 */
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}
