// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="FOREWORD.html"><strong aria-hidden="true">1.</strong> Foreword</a></li><li class="chapter-item expanded "><a href="FAQ.html"><strong aria-hidden="true">2.</strong> Frequently-asked questions</a></li><li class="chapter-item expanded "><a href="project/index.html"><strong aria-hidden="true">3.</strong> Project</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="project/roadmap.html"><strong aria-hidden="true">3.1.</strong> Roadmap</a></li><li class="chapter-item expanded "><a href="project/development.html"><strong aria-hidden="true">3.2.</strong> Development</a></li><li class="chapter-item expanded "><a href="project/hw-requirements.html"><strong aria-hidden="true">3.3.</strong> Hardware requirements</a></li></ol></li><li class="chapter-item expanded "><a href="concepts/index.html"><strong aria-hidden="true">4.</strong> Concepts</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="concepts/applications.html"><strong aria-hidden="true">4.1.</strong> Applications</a></li><li class="chapter-item expanded "><a href="concepts/libraries.html"><strong aria-hidden="true">4.2.</strong> Libraries</a></li><li class="chapter-item expanded "><a href="concepts/users.html"><strong aria-hidden="true">4.3.</strong> Users</a></li></ol></li><li class="chapter-item expanded "><a href="features/index.html"><strong aria-hidden="true">5.</strong> Features</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="features/balancer.html"><strong aria-hidden="true">5.1.</strong> The balancer</a></li><li class="chapter-item expanded "><a href="features/crash-saves.html"><strong aria-hidden="true">5.2.</strong> Crash saves</a></li><li class="chapter-item expanded "><a href="features/domains.html"><strong aria-hidden="true">5.3.</strong> Domains</a></li><li class="chapter-item expanded "><a href="features/encryption.html"><strong aria-hidden="true">5.4.</strong> Encryption</a></li><li class="chapter-item expanded "><a href="features/freeze-prevention.html"><strong aria-hidden="true">5.5.</strong> Freeze-prevention system</a></li><li class="chapter-item expanded "><a href="features/parental-control.html"><strong aria-hidden="true">5.6.</strong> Parental control</a></li><li class="chapter-item expanded "><a href="features/sandboxes.html"><strong aria-hidden="true">5.7.</strong> Sandboxes</a></li><li class="chapter-item expanded "><a href="features/synchronization.html"><strong aria-hidden="true">5.8.</strong> Synchronization</a></li></ol></li><li class="chapter-item expanded "><a href="technical/index.html"><strong aria-hidden="true">6.</strong> Technical</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="technical/overview.html"><strong aria-hidden="true">6.1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="technical/controller.html"><strong aria-hidden="true">6.2.</strong> The controller</a></li><li class="chapter-item expanded "><a href="technical/dev-mode.html"><strong aria-hidden="true">6.3.</strong> Developer mode</a></li><li class="chapter-item expanded "><a href="technical/devices.html"><strong aria-hidden="true">6.4.</strong> Devices</a></li><li class="chapter-item expanded "><a href="technical/file-formats.html"><strong aria-hidden="true">6.5.</strong> File formats</a></li><li class="chapter-item expanded "><a href="technical/io-manager.html"><strong aria-hidden="true">6.6.</strong> I/O manager</a></li><li class="chapter-item expanded "><a href="technical/multi-platform.html"><strong aria-hidden="true">6.7.</strong> Multi-platform management</a></li><li class="chapter-item expanded "><a href="technical/performances.html"><strong aria-hidden="true">6.8.</strong> Performances</a></li><li class="chapter-item expanded "><a href="technical/pre-compiling.html"><strong aria-hidden="true">6.9.</strong> Pre-compiling applications</a></li><li class="chapter-item expanded "><a href="technical/processes.html"><strong aria-hidden="true">6.10.</strong> Processes</a></li><li class="chapter-item expanded "><a href="technical/registry.html"><strong aria-hidden="true">6.11.</strong> The registry</a></li><li class="chapter-item expanded "><a href="technical/services.html"><strong aria-hidden="true">6.12.</strong> Services</a></li><li class="chapter-item expanded "><a href="technical/shell.html"><strong aria-hidden="true">6.13.</strong> The shell</a></li></ol></li><li class="chapter-item expanded "><a href="ux/index.html"><strong aria-hidden="true">7.</strong> User Experience</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="ux/desktop-environment.html"><strong aria-hidden="true">7.1.</strong> Desktop environments</a></li><li class="chapter-item expanded "><a href="ux/notifications.html"><strong aria-hidden="true">7.2.</strong> Notifications</a></li><li class="chapter-item expanded "><a href="ux/sound.html"><strong aria-hidden="true">7.3.</strong> Sound</a></li></ol></li><li class="chapter-item expanded "><a href="specs/index.html"><strong aria-hidden="true">8.</strong> Specifications</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="specs/applications-libraries.html"><strong aria-hidden="true">8.1.</strong> Applications and libraries</a></li><li class="chapter-item expanded "><a href="specs/applications.html"><strong aria-hidden="true">8.2.</strong> Applications</a></li><li class="chapter-item expanded "><a href="specs/libraries.html"><strong aria-hidden="true">8.3.</strong> Libraries</a></li><li class="chapter-item expanded "><a href="specs/filesystem.html"><strong aria-hidden="true">8.4.</strong> Filesystem</a></li><li class="chapter-item expanded "><a href="specs/storage-permissions.html"><strong aria-hidden="true">8.5.</strong> Storage permissions</a></li><li class="chapter-item expanded "><a href="specs/boot-process.html"><strong aria-hidden="true">8.6.</strong> The boot process</a></li><li class="chapter-item expanded "><a href="specs/update-processes.html"><strong aria-hidden="true">8.7.</strong> Update processes</a></li><li class="chapter-item expanded "><a href="specs/permissions.html"><strong aria-hidden="true">8.8.</strong> Permissions</a></li><li class="chapter-item expanded "><a href="specs/containers.html"><strong aria-hidden="true">8.9.</strong> Containers</a></li><li class="chapter-item expanded "><a href="specs/registry.html"><strong aria-hidden="true">8.10.</strong> The registry</a></li><li class="chapter-item expanded "><a href="specs/vocabulary.html"><strong aria-hidden="true">8.11.</strong> Vocabulary</a></li><li class="chapter-item expanded "><a href="specs/shell.html"><strong aria-hidden="true">8.12.</strong> The shell</a></li><li class="chapter-item expanded "><a href="specs/shell-scripting.html"><strong aria-hidden="true">8.13.</strong> Shell scripting</a></li><li class="chapter-item expanded "><a href="specs/crash-saves.html"><strong aria-hidden="true">8.14.</strong> Crash saves</a></li><li class="chapter-item expanded "><a href="specs/services.html"><strong aria-hidden="true">8.15.</strong> Services</a></li><li class="chapter-item expanded "><a href="specs/translations.html"><strong aria-hidden="true">8.16.</strong> Translations</a></li><li class="chapter-item expanded "><a href="specs/kernel/index.html"><strong aria-hidden="true">8.17.</strong> Kernel</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="specs/kernel/hardware.html"><strong aria-hidden="true">8.17.1.</strong> Hardware</a></li><li class="chapter-item expanded "><a href="specs/kernel/memory.html"><strong aria-hidden="true">8.17.2.</strong> Memory</a></li><li class="chapter-item expanded "><a href="specs/kernel/processes.html"><strong aria-hidden="true">8.17.3.</strong> Processes</a></li><li class="chapter-item expanded "><a href="specs/kernel/scheduling.html"><strong aria-hidden="true">8.17.4.</strong> Scheduling</a></li><li class="chapter-item expanded "><a href="specs/kernel/data-structures.html"><strong aria-hidden="true">8.17.5.</strong> Data structures</a></li><li class="chapter-item expanded "><a href="specs/kernel/kpc.html"><strong aria-hidden="true">8.17.6.</strong> Kernel-process communication</a></li><li class="chapter-item expanded "><a href="specs/kernel/ipc.html"><strong aria-hidden="true">8.17.7.</strong> Inter-process communication</a></li><li class="chapter-item expanded "><a href="specs/kernel/signals.html"><strong aria-hidden="true">8.17.8.</strong> Signals</a></li><li class="chapter-item expanded "><a href="specs/kernel/syscalls.html"><strong aria-hidden="true">8.17.9.</strong> System calls</a></li></ol></li><li class="chapter-item expanded "><a href="specs/services/integration/index.html"><strong aria-hidden="true">8.18.</strong> Integration services</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="specs/services/integration/desktop-environments.html"><strong aria-hidden="true">8.18.1.</strong> Desktop environments</a></li><li class="chapter-item expanded "><a href="specs/services/integration/file-managers.html"><strong aria-hidden="true">8.18.2.</strong> File managers</a></li><li class="chapter-item expanded "><a href="specs/services/integration/file-openers.html"><strong aria-hidden="true">8.18.3.</strong> File openers</a></li><li class="chapter-item expanded "><a href="specs/services/integration/filesystem-interfaces.html"><strong aria-hidden="true">8.18.4.</strong> Filesystem interfaces</a></li></ol></li><li class="chapter-item expanded "><a href="specs/services/drivers/index.html"><strong aria-hidden="true">8.19.</strong> Driver services</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="specs/services/drivers/storage.html"><strong aria-hidden="true">8.19.1.</strong> Storage driver service</a></li></ol></li><li class="chapter-item expanded "><a href="specs/services/system/index.html"><strong aria-hidden="true">8.20.</strong> System services</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="specs/services/system/fs.html"><strong aria-hidden="true">8.20.1.</strong> sys::fs</a></li><li class="chapter-item expanded "><a href="specs/services/system/fsh.html"><strong aria-hidden="true">8.20.2.</strong> sys::fsh</a></li><li class="chapter-item expanded "><a href="specs/services/system/hw.html"><strong aria-hidden="true">8.20.3.</strong> sys::hw</a></li><li class="chapter-item expanded "><a href="specs/services/system/perm.html"><strong aria-hidden="true">8.20.4.</strong> sys::perm</a></li><li class="chapter-item expanded "><a href="specs/services/system/net.html"><strong aria-hidden="true">8.20.5.</strong> sys::net</a></li><li class="chapter-item expanded "><a href="specs/services/system/crypto.html"><strong aria-hidden="true">8.20.6.</strong> sys::crypto</a></li><li class="chapter-item expanded "><a href="specs/services/system/crashsave.html"><strong aria-hidden="true">8.20.7.</strong> sys::crashsave</a></li><li class="chapter-item expanded "><a href="specs/services/system/hydre.html"><strong aria-hidden="true">8.20.8.</strong> sys::hydre</a></li><li class="chapter-item expanded "><a href="specs/services/system/app.html"><strong aria-hidden="true">8.20.9.</strong> sys::app</a></li><li class="chapter-item expanded "><a href="specs/services/system/process.html"><strong aria-hidden="true">8.20.10.</strong> sys::process</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="applications/index.html"><strong aria-hidden="true">9.</strong> Applications</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="applications/Astral.html"><strong aria-hidden="true">9.1.</strong> Astral</a></li><li class="chapter-item expanded "><a href="applications/BareEnv.html"><strong aria-hidden="true">9.2.</strong> BareEnv</a></li><li class="chapter-item expanded "><a href="applications/Blackhole.html"><strong aria-hidden="true">9.3.</strong> Blackhole</a></li><li class="chapter-item expanded "><a href="applications/Central.html"><strong aria-hidden="true">9.4.</strong> Central</a></li><li class="chapter-item expanded "><a href="applications/Cloudy.html"><strong aria-hidden="true">9.5.</strong> Cloudy</a></li><li class="chapter-item expanded "><a href="applications/Comet.html"><strong aria-hidden="true">9.6.</strong> Comet</a></li><li class="chapter-item expanded "><a href="applications/Gravity.html"><strong aria-hidden="true">9.7.</strong> Gravity</a></li><li class="chapter-item expanded "><a href="applications/Locky.html"><strong aria-hidden="true">9.8.</strong> Locky</a></li><li class="chapter-item expanded "><a href="applications/Milkshake.html"><strong aria-hidden="true">9.9.</strong> Milkshake</a></li><li class="chapter-item expanded "><a href="applications/Monitor.html"><strong aria-hidden="true">9.10.</strong> Monitor</a></li><li class="chapter-item expanded "><a href="applications/Nova.html"><strong aria-hidden="true">9.11.</strong> Nova</a></li><li class="chapter-item expanded "><a href="applications/Particle.html"><strong aria-hidden="true">9.12.</strong> Particle</a></li><li class="chapter-item expanded "><a href="applications/Pluton.html"><strong aria-hidden="true">9.13.</strong> Pluton</a></li><li class="chapter-item expanded "><a href="applications/Postal.html"><strong aria-hidden="true">9.14.</strong> Postal</a></li><li class="chapter-item expanded "><a href="applications/Reader.html"><strong aria-hidden="true">9.15.</strong> Reader</a></li><li class="chapter-item expanded "><a href="applications/Registry.html"><strong aria-hidden="true">9.16.</strong> Registry</a></li><li class="chapter-item expanded "><a href="applications/Rocket.html"><strong aria-hidden="true">9.17.</strong> Rocket</a></li><li class="chapter-item expanded "><a href="applications/ShootingStar.html"><strong aria-hidden="true">9.18.</strong> ShootingStar</a></li><li class="chapter-item expanded "><a href="applications/Skyer.html"><strong aria-hidden="true">9.19.</strong> Skyer</a></li><li class="chapter-item expanded "><a href="applications/Sonata.html"><strong aria-hidden="true">9.20.</strong> Sonata</a></li><li class="chapter-item expanded "><a href="applications/Stellar.html"><strong aria-hidden="true">9.21.</strong> Stellar</a></li><li class="chapter-item expanded "><a href="applications/Thinker.html"><strong aria-hidden="true">9.22.</strong> Thinker</a></li><li class="chapter-item expanded "><a href="applications/TimeTravel.html"><strong aria-hidden="true">9.23.</strong> TimeTravel</a></li><li class="chapter-item expanded "><a href="applications/Vortex.html"><strong aria-hidden="true">9.24.</strong> Vortex</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
