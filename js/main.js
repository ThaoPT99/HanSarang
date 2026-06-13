/* ==========================================
   THÔNG TIN TRƯỜNG HÀN - Main JavaScript
   ========================================== */

// ===== Utility Functions =====
function $(id) { return document.getElementById(id); }

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// ===== Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    const navbar = $('navbar');
    const navToggle = $('navToggle');
    const navLinks = $('navLinks');
    const backToTop = $('backToTop');

    // Scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Back to top
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// ===== University Card Renderer =====
function getRegionBadge(region) {
    const regions = {
        'Seoul': 'badge-seoul',
        'Busan': 'badge-busan',
        'Daejeon': 'badge-daejeon'
    };
    return regions[region] || '';
}

function getTierBadge(tier) {
    if (tier === 'SKY') return 'badge-sky';
    if (tier === 'Top 10' || tier === 'Đặc biệt') return 'badge-top10';
    return '';
}

function getTypeBadge(type) {
    if (type === 'Công lập') return 'badge-public';
    if (type === 'Tư thục') return 'badge-private';
    return '';
}

function getInitials(name) {
    const words = name.split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[words.length-1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function renderUniversityCard(u, featured) {
    const tierBadge = getTierBadge(u.tier);
    const typeBadge = getTypeBadge(u.type);
    const regionBadge = getRegionBadge(u.region);

    let badges = '';
    if (tierBadge) badges += `<span class="badge ${tierBadge}">${u.tier}</span>`;
    if (typeBadge) badges += `<span class="badge ${typeBadge}">${u.type}</span>`;
    if (regionBadge) badges += `<span class="badge ${regionBadge}">${u.region}</span>`;
    if (u.tier === 'Ngôn ngữ') badges += `<span class="badge badge-seoul">📚 Tiếng Hàn</span>`;

    const hasGKS = u.tags && u.tags.includes('hoc-bong-gks');
    if (hasGKS) badges += `<span class="badge badge-gks">🎯 GKS</span>`;

    const logoHtml = u.image
        ? `<img src="${u.image}" alt="${u.name}" onerror="this.parentElement.innerHTML='<div class=\\'card-logo-placeholder\\'>${getInitials(u.name)}</div>'">`
        : `<div class="card-logo-placeholder">${getInitials(u.name)}</div>`;

    return `
        <div class="university-card" onclick="window.location.href='chi-tiet-truong.html?id=${u.id}'">
            <div class="card-header">
                <div class="card-logo">${logoHtml}</div>
                <div class="card-title">
                    <h3>${u.name}</h3>
                    <div class="kr-name">${u.nameKr}</div>
                </div>
            </div>
            <div class="card-badges">${badges}</div>
            <div class="card-body">
                <p class="card-desc">${u.description}</p>
            </div>
            <div class="card-footer">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i> ${u.region}
                </div>
                <div class="info-item">
                    <i class="fas fa-won-sign"></i> ${u.tuition}
                </div>
                <div class="info-item">
                    <i class="fas fa-language"></i> ${u.language.join(', ')}
                </div>
            </div>
        </div>
    `;
}

// ===== Homepage: Featured Universities =====
function initHomepage() {
    const grid = $('featuredGrid');
    if (!grid) return;

    const featured = universities.filter(u => u.featured).slice(0, 6);
    grid.innerHTML = featured.map(u => renderUniversityCard(u, true)).join('');
}

// ===== University List Page =====
let currentFilter = {
    search: '',
    region: '',
    type: '',
    tier: '',
    tag: ''
};
let currentPage = 1;
const ITEMS_PER_PAGE = 12;
let currentViewMode = 'grid';

function initUniversityList() {
    const grid = $('resultsGrid');
    if (!grid) return;

    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const compareParam = urlParams.get('compare');

    // Populate region filter
    const regionSelect = $('regionFilter');
    if (regionSelect) {
        const regions = [...new Set(universities.map(u => u.region))];
        regions.sort().forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r + (window.regions && window.regions[r] ? ` (${window.regions[r].name})` : '');
            regionSelect.appendChild(opt);
        });
    }

    // Handle filter param
    if (filterParam === 'seoul') $('regionFilter').value = 'Seoul';
    else if (filterParam === 'busan') $('regionFilter').value = 'Busan';
    else if (filterParam === 'scholarship') {
        currentFilter.tag = 'hoc-bong-gks';
        document.querySelectorAll('.filter-tag').forEach(t => {
            t.classList.toggle('active', t.dataset.tag === 'hoc-bong-gks');
        });
    }
    else if (filterParam === 'science') {
        currentFilter.tag = 'ky-thuat';
        document.querySelectorAll('.filter-tag').forEach(t => {
            t.classList.toggle('active', t.dataset.tag === 'ky-thuat');
        });
    }

    // Populate compare selects
    populateCompareSelects();

    filterUniversities();
}

function filterUniversities() {
    const searchVal = ($('searchInput')?.value || '').toLowerCase().trim();
    const regionVal = $('regionFilter')?.value || '';
    const typeVal = $('typeFilter')?.value || '';
    const tierVal = $('tierFilter')?.value || '';

    let results = universities.filter(u => {
        // Search
        if (searchVal) {
            const match = u.name.toLowerCase().includes(searchVal) ||
                u.nameKr.toLowerCase().includes(searchVal) ||
                u.nameEn.toLowerCase().includes(searchVal) ||
                u.region.toLowerCase().includes(searchVal) ||
                (u.popularFor && u.popularFor.some(p => p.toLowerCase().includes(searchVal)));
            if (!match) return false;
        }
        // Region
        if (regionVal && u.region !== regionVal) return false;
        // Type
        if (typeVal && u.type !== typeVal) return false;
        // Tier
        if (tierVal && u.tier !== tierVal) return false;
        // Tag
        if (currentFilter.tag && (!u.tags || !u.tags.includes(currentFilter.tag))) return false;

        return true;
    });

    // Update count
    const countEl = $('resultsCount');
    if (countEl) countEl.textContent = results.length;

    // Paginate
    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = results.slice(start, start + ITEMS_PER_PAGE);

    // Render
    const grid = $('resultsGrid');
    if (grid) {
        grid.innerHTML = pageItems.length
            ? pageItems.map(u => renderUniversityCard(u)).join('')
            : `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
                <h3 style="margin-bottom: 8px;">Không tìm thấy trường</h3>
                <p style="color: var(--text-muted);">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
               </div>`;
    }

    // Pagination
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = $('pagination');
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
    html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    filterUniversities();
    window.scrollTo({ top: $('filtersSection').offsetTop - 100, behavior: 'smooth' });
}

function setTagFilter(el, tag) {
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    currentFilter.tag = tag || '';
    currentPage = 1;
    filterUniversities();
}

function setViewMode(mode) {
    currentViewMode = mode;
    const grid = $('resultsGrid');
    if (!grid) return;
    grid.className = 'results-grid' + (mode === 'list' ? ' list-view' : '');
    document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
    document.querySelector(`.view-toggle button[onclick*="${mode}"]`)?.classList.add('active');
}

// ===== Compare Tool =====
function showCompareSection() {
    const section = $('compareSection');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function populateCompareSelects() {
    [1, 2, 3].forEach(i => {
        const select = $(`compare${i}`);
        if (!select) return;
        select.innerHTML = '<option value="">Chọn trường...</option>';
        universities.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = `${u.name} (${u.region})`;
            select.appendChild(opt);
        });
    });
}

function updateCompare() {
    const ids = [1, 2, 3].map(i => $(`compare${i}`)?.value).filter(v => v);
    const container = $('compareResults');
    if (!container) return;

    if (ids.length < 2) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 24px;">Chọn ít nhất 2 trường để so sánh</p>';
        return;
    }

    const selected = ids.map(id => universities.find(u => u.id === id)).filter(Boolean);

    let html = '<table class="compare-table">';
    html += '<tr><th>Tiêu chí</th>' + selected.map(u => `<th>${u.name}</th>`).join('') + '</tr>';

    const fields = [
        { label: 'Khu vực', key: 'region' },
        { label: 'Loại hình', key: 'type' },
        { label: 'Xếp hạng', key: 'tier' },
        { label: 'Học phí', key: 'tuition' },
        { label: 'Ngôn ngữ', key: 'language', fn: v => v.join(', ') },
        { label: 'Yêu cầu TOPIK', key: 'topikRequired' },
        { label: 'Yêu cầu IELTS', key: 'englishRequired' },
        { label: 'Số lượng SV', key: 'studentCount' },
        { label: 'Học bổng', key: 'scholarship', fn: v => v.slice(0, 2).join('<br>') },
        { label: 'Ngành nổi bật', key: 'popularFor', fn: v => v.slice(0, 3).join(', ') },
    ];

    fields.forEach(f => {
        const values = selected.map(u => {
            let val = f.fn ? f.fn(u[f.key]) : u[f.key];
            return val || 'N/A';
        });
        // Highlight best value (for tuition - lowest)
        html += `<tr><td>${f.label}</td>${values.map(v => `<td>${v}</td>`).join('')}</tr>`;
    });

    html += '</table>';
    container.innerHTML = html;
}

// ===== University Detail Page =====
function initUniversityDetail() {
    const container = $('detailContainer');
    if (!container) return;

    const id = getQueryParam('id');
    if (!id) {
        container.innerHTML = '<div style="text-align: center; padding: 60px;"><h3>Không tìm thấy trường</h3><p style="color: var(--text-muted);">ID trường không hợp lệ</p></div>';
        return;
    }

    const u = universities.find(u => u.id === id);
    if (!u) {
        container.innerHTML = '<div style="text-align: center; padding: 60px;"><h3>Không tìm thấy trường</h3><p style="color: var(--text-muted);">Trường không tồn tại trong cơ sở dữ liệu</p></div>';
        return;
    }

    document.title = `${u.name} - Thông Tin Trường Hàn`;

    const tierBadge = getTierBadge(u.tier);
    const typeBadge = getTypeBadge(u.type);
    const regionBadge = getRegionBadge(u.region);

    let badges = '';
    if (tierBadge) badges += `<span class="badge ${tierBadge}">${u.tier}</span>`;
    if (typeBadge) badges += `<span class="badge ${typeBadge}">${u.type}</span>`;
    if (regionBadge) badges += `<span class="badge ${regionBadge}">${u.region}</span>`;
    if ((u.tags && u.tags.includes('hoc-bong-gks'))) badges += `<span class="badge badge-gks">🎯 Học bổng GKS</span>`;

    const logoHtml = u.image
        ? `<img src="${u.image}" alt="${u.name}" onerror="this.parentElement.innerHTML='<div class=\\'detail-logo-placeholder\\'>${getInitials(u.name)}</div>'">`
        : `<div class="detail-logo-placeholder">${getInitials(u.name)}</div>`;

    // Update SEO meta tags dynamically
    const desc = `${u.name} - Thông tin chi tiết: học phí ${u.tuition}, yêu cầu TOPIK ${u.topikRequired}, học bổng, ngành học nổi bật: ${u.popularFor.slice(0,3).join(', ')}. Dành cho du học sinh Việt Nam.`;
    document.getElementById('detailDesc')?.setAttribute('content', desc);
    document.getElementById('ogDesc')?.setAttribute('content', desc);
    document.getElementById('twDesc')?.setAttribute('content', desc);
    document.getElementById('detailCanonical')?.setAttribute('href', `https://thongtintruonghan.com/chi-tiet-truong.html?id=${u.id}`);

    // Inject JSON-LD structured data (CollegeOrUniversity)
    const ldScript = document.createElement('script');
    ldScript.type = 'application/ld+json';
    ldScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": u.name,
        "alternateName": u.nameEn,
        "description": u.description,
        "url": `https://thongtintruonghan.com/chi-tiet-truong.html?id=${u.id}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": u.region,
            "addressCountry": "KR"
        },
        "foundingDate": String(u.established),
        "numberOfEmployees": u.studentCount
    });
    document.head.appendChild(ldScript);

    container.innerHTML = `
        <div class="detail-hero">
            <div class="detail-header">
                <div class="detail-logo">${logoHtml}</div>
                <div class="detail-title">
                    <h1>${u.name}</h1>
                    <div class="kr-name">${u.nameKr}</div>
                    <div class="en-name">${u.nameEn}</div>
                    <div class="detail-badges">${badges}</div>
                </div>
            </div>
            <div class="detail-meta">
                <div class="detail-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <div class="meta-label">Khu vực</div>
                        <div class="meta-value">${u.region}</div>
                    </div>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <div class="meta-label">Năm thành lập</div>
                        <div class="meta-value">${u.established}</div>
                    </div>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <div class="meta-label">Số lượng sinh viên</div>
                        <div class="meta-value">${u.studentCount}</div>
                    </div>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-won-sign"></i>
                    <div>
                        <div class="meta-label">Học phí</div>
                        <div class="meta-value">${u.tuition}</div>
                    </div>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-language"></i>
                    <div>
                        <div class="meta-label">Ngôn ngữ giảng dạy</div>
                        <div class="meta-value">${u.language.join(', ')}</div>
                    </div>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-globe"></i>
                    <div>
                        <div class="meta-label">Website</div>
                        <div class="meta-value"><a href="${u.website}" target="_blank" rel="noopener noreferrer">${u.website}</a></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-content">
            <div class="detail-main">
                <h2>Giới thiệu</h2>
                <p>${u.description}</p>

                <h2>Chương trình đào tạo</h2>
                <div class="programs-list">
                    ${u.programs.map(p => `<span class="program-tag">${p}</span>`).join('')}
                </div>

                <h2>Ngành học nổi bật</h2>
                <div class="programs-list">
                    ${u.popularFor.map(p => `<span class="language-tag">${p}</span>`).join('')}
                </div>

                <h2>Yêu cầu đầu vào</h2>
                <table style="width:100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid var(--border-light);">
                        <td style="padding: 12px 8px; font-weight: 600;">TOPIK</td>
                        <td style="padding: 12px 8px;">${u.topikRequired}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-light);">
                        <td style="padding: 12px 8px; font-weight: 600;">IELTS/TOEFL</td>
                        <td style="padding: 12px 8px;">${u.englishRequired}</td>
                    </tr>
                </table>

                <h2>Sinh viên Việt Nam</h2>
                <div class="info-box">
                    <p>${u.vietnameseStudents}</p>
                </div>

                <h2>Đánh giá & Nhận xét</h2>
                <div id="reviewsContainer">
                    <!-- Reviews rendered by ReviewSystem -->
                </div>
            </div>

            <div class="detail-sidebar">
                <div class="sidebar-card">
                    <h3>💖 Quan tâm</h3>
                    <button class="wishlist-btn ${WishlistApp.isInList(u.id) ? 'active' : ''}" data-id="${u.id}" onclick="WishlistApp.toggle('${u.id}')" style="font-size:1.2rem; width:100%; padding:12px;">
                        ${WishlistApp.isInList(u.id) ? '<i class="fas fa-heart"></i> Đã lưu' : '<i class="far fa-heart"></i> Lưu trường này'}
                    </button>
                </div>
                <div class="sidebar-card">
                    <h3>📊 Thông tin nhanh</h3>
                    <div class="sidebar-info-item">
                        <span class="label">Năm thành lập</span>
                        <span class="value">${u.established}</span>
                    </div>
                    <div class="sidebar-info-item">
                        <span class="label">Khu vực</span>
                        <span class="value">${u.region}</span>
                    </div>
                    <div class="sidebar-info-item">
                        <span class="label">Loại hình</span>
                        <span class="value">${u.type}</span>
                    </div>
                    <div class="sidebar-info-item">
                        <span class="label">Học phí</span>
                        <span class="value">${u.tuition}</span>
                    </div>
                    <div class="sidebar-info-item">
                        <span class="label">SV quốc tế</span>
                        <span class="value">${u.internationalStudentRatio}</span>
                    </div>
                </div>

                <div class="sidebar-card">
                    <h3>Học bổng</h3>
                    <ul class="scholarship-list">
                        ${u.scholarship.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>

                <div class="sidebar-card">
                    <h3 style="border:none;">⭐ Đánh giá</h3>
                    <div style="font-size:2.5rem; text-align:center; font-weight:800;">
                        <span id="detailAvgRating" style="background:var(--bg-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">${ReviewSystem.getAverageRating(id)}</span>
                        <span style="font-size:1rem; color:var(--text-muted);">/5</span>
                    </div>
                    <div style="text-align:center; color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
                        <span id="detailReviewCount">${ReviewSystem.getRatingCount(id)}</span> đánh giá
                    </div>
                    <button onclick="ReviewSystem.openReviewForm('${id}')" class="btn btn-primary btn-sm" style="width:100%; justify-content:center;">
                        <i class="fas fa-star"></i> Viết đánh giá
                    </button>
                </div>
                <div class="sidebar-card">
                    <h3>Liên kết</h3>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <a href="${u.website}" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; justify-content: center;">
                            <i class="fas fa-globe"></i> Website trường
                        </a>
                        <button onclick="window.location.href='truong-hoc.html?compare=true'" class="btn btn-secondary btn-sm" style="text-align: center; justify-content: center;">
                            <i class="fas fa-balance-scale"></i> So sánh với trường khác
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize reviews and wishlist
    if (typeof ReviewSystem !== 'undefined') {
        ReviewSystem.displayReviews(id);
    }
    if (typeof WishlistApp !== 'undefined') {
        WishlistApp.updateUI(id);
    }
}

// ===== Page Initializations =====
document.addEventListener('DOMContentLoaded', function() {
    // Homepage
    initHomepage();

    // Check if we're on the detail page
    if ($('detailContainer')) {
        initUniversityDetail();
    }

    // Compare section auto-show from hash/param
    if (getQueryParam('compare') === 'true' && !$('compareSection')?.style.display) {
        const compareSection = $('compareSection');
        if (compareSection && compareSection.style.display !== 'block') {
            compareSection.style.display = 'block';
            setTimeout(() => compareSection.scrollIntoView({ behavior: 'smooth' }), 300);
        }
    }
});
