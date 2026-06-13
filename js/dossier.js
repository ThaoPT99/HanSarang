/* ==========================================
   THÔNG TIN TRƯỜNG HÀN - Dossier App
   Quản lý hồ sơ du học Hàn Quốc
   ========================================== */

const DossierApp = {
    documents: {
        personal: [
            { id: 'passport', icon: '🛂', title: 'Hộ chiếu (Passport)', desc: 'Còn hạn tối thiểu 6 tháng. Nếu chưa có, làm ngay tại Phòng Quản lý Xuất nhập cảnh.', details: 'Thời gian làm: 5-8 ngày. Lệ phí: 200,000đ. Yêu cầu: CCCD + ảnh 4x6.' },
            { id: 'cccd', icon: '🪪', title: 'Căn cước công dân (CCCD)', desc: 'Bản photo công chứng của học sinh và bố/mẹ (nếu là người bảo lãnh tài chính).', details: 'Photo 2 mặt cùng trang. Công chứng tại UBND phường/xã.' },
            { id: 'household', icon: '🏠', title: 'Sổ hộ khẩu (hoặc CT07)', desc: 'Bản sao công chứng. Nếu ở trọ, xin giấy xác nhận cư trú (CT07) tại công an phường.', details: 'CT07 thay thế sổ hộ khẩu từ 2023. Thời hạn 6 tháng.' },
            { id: 'birth-cert', icon: '👶', title: 'Trích lục khai sinh', desc: 'Bản sao trích lục khai sinh (cấp trong 3 tháng gần nhất).', details: 'Xin tại UBND phường nơi đăng ký khai sinh. Phí: 3,000-5,000đ.' },
            { id: 'photos', icon: '📸', title: 'Ảnh thẻ (3x4 hoặc 3.5x4.5)', desc: 'Nền trắng, chụp trong 6 tháng gần nhất. Số lượng: 8-12 ảnh.', details: 'Áo sơ mi trắng/có cổ. Không đeo kính. Không chỉnh sửa.' },
            { id: 'cv', icon: '📋', title: 'Sơ yếu lý lịch (CV)', desc: 'Tóm tắt thông tin cá nhân, học vấn, kinh nghiệm, kỹ năng.', details: 'Viết bằng tiếng Hàn hoặc tiếng Anh. Dài 1-2 trang A4.' }
        ],
        education: [
            { id: 'diploma-hs', icon: '🎓', title: 'Bằng tốt nghiệp THPT/Đại học', desc: 'Bản gốc + bản sao công chứng + dịch thuật tiếng Hàn/Anh.', details: 'Tem vàng (Sở Ngoại vụ) + tem tím (Lãnh sự quán Hàn) là bắt buộc.' },
            { id: 'transcript', icon: '📊', title: 'Học bạ / Bảng điểm', desc: 'Bản gốc + bản sao công chứng + dịch thuật. GPA càng cao càng tốt.', details: 'Yêu cầu GPA tối thiểu: 6.0/10 (hệ Cử nhân), 7.0/10 (hệ Thạc sĩ).' },
            { id: 'student-cert', icon: '📜', title: 'Giấy xác nhận sinh viên', desc: 'Nếu đang học tại trường khác. Xin tại phòng đào tạo của trường.', details: 'Còn hiệu lực trong 3 tháng. Ghi rõ thông tin sinh viên và ngành học.' },
            { id: 'topik-cert', icon: '🇰🇷', title: 'Chứng chỉ TOPIK', desc: 'Nếu đã thi TOPIK. Càng cao càng lợi thế (TOPIK 3+ để vào ĐH).', details: 'TOPIK có hiệu lực 2 năm. Nếu chưa có, có thể nộp sau hoặc học tiếng trước.' },
            { id: 'english-cert', icon: '📖', title: 'Chứng chỉ tiếng Anh', desc: 'IELTS/TOEFL nếu học chương trình tiếng Anh. IELTS 6.0+ / TOEFL 80+.', details: 'Hiệu lực 2 năm. Một số trường nhận Duolingo English Test.' },
            { id: 'rec-letter', icon: '✉️', title: 'Thư giới thiệu (2-3 thư)', desc: 'Từ giáo viên chủ nhiệm, giáo sư hoặc người quản lý. Có chữ ký + đóng dấu.', details: 'Viết bằng tiếng Anh hoặc tiếng Hàn. Nội dung cụ thể về năng lực học tập.' }
        ],
        finance: [
            { id: 'bank-book', icon: '🏦', title: 'Sổ tiết kiệm', desc: 'Đứng tên học sinh. Số dư: 10,000-20,000 USD (tùy khu vực). Mở trước 3-6 tháng.', details: 'Seoul: 12,000+ USD, tỉnh khác: 10,000+ USD. Cần giấy xác nhận số dư.' },
            { id: 'income-proof', icon: '💼', title: 'Chứng minh thu nhập bố/mẹ', desc: 'Hợp đồng lao động, sao kê lương 3-6 tháng, giấy phép kinh doanh (nếu tự kinh doanh).', details: 'Thu nhập tối thiểu: 1,000 USD/tháng. Cần sao kê tài khoản ngân hàng.' },
            { id: 'asset-proof', icon: '🏠', title: 'Giấy tờ sở hữu tài sản', desc: 'Sổ đỏ nhà đất, giấy tờ xe, cổ phiếu... chứng minh tài chính gia đình.', details: 'Đứng tên bố/mẹ. Có thể dùng thêm để tăng độ thuyết phục.' },
            { id: 'sponsor-letter', icon: '📝', title: 'Cam kết bảo lãnh tài chính', desc: 'Cam kết của bố/mẹ về việc chi trả học phí và sinh hoạt phí cho học sinh.', details: 'Có công chứng. Ghi rõ số tiền cam kết và thời gian.' }
        ],
        health: [
            { id: 'health-check', icon: '🏥', title: 'Giấy khám sức khỏe', desc: 'Khám tổng quát + X-quang phổi tại bệnh viện được ĐSQ Hàn chỉ định.', details: 'Bệnh viện: Bạch Mai, Chợ Rẫy, Đại học Y Dược... Giấy có hiệu lực 6 tháng.' },
            { id: 'tb-test', icon: '🔬', title: 'Xét nghiệm lao phổi', desc: 'Kết quả X-quang phổi hoặc xét nghiệm IGRA/T-SPOT.', details: 'Nghiêm ngặt: lao phổi là lý do trượt visa phổ biến. Làm đúng bệnh viện chỉ định.' },
            { id: 'insurance', icon: '🛡️', title: 'Bảo hiểm du học', desc: 'Mua bảo hiểm du học trước khi bay. Bắt buộc sau khi nhập học.', details: 'Bảo hiểm NHIS: ~65 USD/tháng. Có thể mua bảo hiểm quốc tế trước khi bay.' }
        ]
    },

    templates: {
        'study-plan': {
            title: '📝 Mẫu Kế hoạch học tập (Study Plan)',
            content: `
                <div class="info-box"><p><strong>💡 Study Plan là gì?</strong> Là bài luận thể hiện mục tiêu du học, lý do chọn trường/ngành và kế hoạch tương lai. Đây là giấy tờ QUAN TRỌNG NHẤT trong bộ hồ sơ.</p></div>
                
                <h3>Cấu trúc Study Plan (3 phần)</h3>
                
                <h4>Phần 1: Giới thiệu bản thân</h4>
                <p>Giới thiệu ngắn gọn: tên, tuổi, quê quán, thành tích học tập nổi bật. Tại sao bạn muốn du học Hàn Quốc? (200-300 từ)</p>
                <p style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-sm); font-style:italic;">
                "Tôi tên là Nguyễn Văn A, sinh năm 2006 tại Hà Nội. Ngay từ nhỏ, tôi đã yêu thích văn hóa Hàn Quốc qua âm nhạc và phim ảnh. Tuy nhiên, điều thôi thúc tôi du học Hàn Quốc hơn cả là chất lượng giáo dục hàng đầu thế giới, đặc biệt trong lĩnh vực Công nghệ thông tin mà tôi theo đuổi..."
                </p>
                
                <h4>Phần 2: Mục tiêu học tập</h4>
                <p>Lý do chọn trường và ngành học cụ thể. Bạn mong muốn học được gì? (300-400 từ)</p>
                <p style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-sm); font-style:italic;">
                "Tôi chọn Đại học Korea vì trường có chương trình Kỹ thuật máy tính xếp hạng top 3 Hàn Quốc. Tôi đặc biệt ấn tượng với phòng thí nghiệm AI của giáo sư Park, nơi đang nghiên cứu về xử lý ngôn ngữ tự nhiên..."
                </p>
                
                <h4>Phần 3: Kế hoạch sau tốt nghiệp</h4>
                <p>Dự định sau khi tốt nghiệp: về Việt Nam làm việc, ở lại Hàn, học lên cao hơn? (200-300 từ)</p>
                <p style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-sm); font-style:italic;">
                "Sau khi tốt nghiệp, tôi dự định trở về Việt Nam làm việc cho các tập đoàn công nghệ Hàn Quốc như Samsung, LG tại thị trường Việt Nam. Tôi tin rằng kiến thức và kỹ năng học được tại Hàn Quốc sẽ giúp tôi đóng góp cho sự phát triển của ngành công nghệ thông tin Việt Nam..."
                </p>

                <div class="info-box"><p><strong>⚠️ Lưu ý:</strong> Study Plan phải thể hiện rõ ý định <strong>trở về Việt Nam</strong> sau khi học. Đây là yếu tố Đại sứ quán xem xét kỹ nhất để tránh định cư bất hợp pháp.</p></div>
            `
        },
        'self-intro': {
            title: '👤 Mẫu Giới thiệu bản thân',
            content: `
                <h3>Hướng dẫn viết giới thiệu bản thân</h3>
                <p>Bài giới thiệu bản thân thường đi kèm với Study Plan. Dài 500-800 từ, trình bày bằng tiếng Hàn hoặc tiếng Anh.</p>
                
                <h4>Cấu trúc đề xuất:</h4>
                <ol>
                    <li><strong>Thông tin cơ bản:</strong> Họ tên, ngày sinh, nơi ở, gia đình (50-100 từ)</li>
                    <li><strong>Học vấn:</strong> Trường học, thành tích, hoạt động ngoại khóa (100-150 từ)</li>
                    <li><strong>Sở thích & Đam mê:</strong> Cá tính, điều khiến bạn khác biệt (50-100 từ)</li>
                    <li><strong>Kinh nghiệm:</strong> Việc làm thêm, tình nguyện, dự án (100-150 từ)</li>
                    <li><strong>Động lực du học Hàn Quốc:</strong> Lý do cụ thể (100-150 từ)</li>
                    <li><strong>Mục tiêu tương lai:</strong> Ngắn hạn và dài hạn (50-100 từ)</li>
                </ol>
                
                <div class="info-box"><p><strong>💡 Mẹo:</strong> Hãy kể câu chuyện của RIÊNG BẠN. Đừng sao chép mẫu có sẵn. Người đọc hồ sơ đọc hàng trăm bộ mỗi ngày - họ sẽ nhận ra ngay nếu bạn copy.</p></div>
            `
        },
        'rec-letter': {
            title: '📝 Mẫu Thư giới thiệu (Recommendation Letter)',
            content: `
                <h3>Thư giới thiệu - Yếu tố quan trọng</h3>
                <p>Hầu hết các trường yêu cầu 2-3 thư giới thiệu từ giáo viên hoặc người quản lý.</p>
                
                <h4>Ai nên viết thư giới thiệu?</h4>
                <ul>
                    <li><strong>Giáo viên chủ nhiệm</strong> - Nhận xét về tính cách, thái độ học tập</li>
                    <li><strong>Giáo sư bộ môn</strong> - Đánh giá năng lực chuyên môn (quan trọng cho bậc Thạc sĩ/Tiến sĩ)</li>
                    <li><strong>Người quản lý</strong> - Nếu đã đi làm, đánh giá năng lực làm việc</li>
                </ul>
                
                <h4>Cấu trúc thư giới thiệu:</h4>
                <ol>
                    <li>Tiêu đề: THƯ GIỚI THIỆU</li>
                    <li>Người viết tự giới thiệu: Tên, chức vụ, nơi công tác, mối quan hệ với học sinh</li>
                    <li>Đánh giá năng lực: Học tập, nghiên cứu, kỹ năng mềm, phẩm chất</li>
                    <li>Ví dụ cụ thể: Thành tích, dự án, hoạt động nổi bật</li>
                    <li>Kết luận: Khẳng định sự phù hợp và đề xuất nhận học sinh</li>
                    <li>Chữ ký + Dấu của trường/cơ quan</li>
                </ol>
                
                <div class="info-box"><p><strong>⚠️ Lưu ý:</strong> Thư giới thiệu cần được viết trên giấy có tiêu đề của trường/cơ quan, có chữ ký và đóng dấu. Bản dịch tiếng Hàn/Anh cũng cần có dấu xác nhận.</p></div>
            `
        },
        'checklist': {
            title: '✅ Checklist đầy đủ giấy tờ du học Hàn Quốc',
            content: `
                <h3>Checklist toàn bộ giấy tờ</h3>
                <table>
                    <tr><th>Nhóm</th><th>Giấy tờ</th><th>Ghi chú</th></tr>
                    <tr><td rowspan="4">Cá nhân</td><td>Hộ chiếu</td><td>Còn hạn 6 tháng+</td></tr>
                    <tr><td>CCCD (bản công chứng)</td><td>Của học sinh + bố mẹ</td></tr>
                    <tr><td>Trích lục khai sinh</td><td>Cấp trong 3 tháng</td></tr>
                    <tr><td>Ảnh thẻ 3x4 (8-12 ảnh)</td><td>Nền trắng, áo trắng</td></tr>
                    <tr><td rowspan="3">Học vấn</td><td>Bằng tốt nghiệp</td><td>Công chứng + dịch thuật</td></tr>
                    <tr><td>Học bạ/Bảng điểm</td><td>Tem vàng + tem tím</td></tr>
                    <tr><td>Thư giới thiệu (2-3)</td><td>Có chữ ký + dấu</td></tr>
                    <tr><td rowspan="3">Tài chính</td><td>Sổ tiết kiệm</td><td>10,000-20,000 USD</td></tr>
                    <tr><td>CM thu nhập bố mẹ</td><td>HĐLĐ/GPKD + sao kê</td></tr>
                    <tr><td>Cam kết bảo lãnh</td><td>Công chứng</td></tr>
                    <tr><td rowspan="2">Sức khỏe</td><td>Khám sức khỏe</td><td>BV chỉ định</td></tr>
                    <tr><td>X-quang phổi</td><td>Kết quả trong 6 tháng</td></tr>
                </table>
                <p style="margin-top:12px;"><strong>📌 Tổng cộng:</strong> Khoảng <strong>20-25 giấy tờ</strong> cần chuẩn bị. Bắt đầu sớm để tránh thiếu sót!</p>
            `
        }
    },

    semesters: {
        spring: {
            label: '🌸 Kỳ tháng 3 (Xuân)',
            timeline: [
                { time: 'T3 - T6 năm trước', title: 'Định hướng', desc: 'Chọn trường, ngành học. Bắt đầu học tiếng Hàn hoặc luyện IELTS.' },
                { time: 'T7 - T8 năm trước', title: 'Chuẩn bị hồ sơ', desc: 'Thu thập giấy tờ, dịch thuật công chứng. Thi TOPIK/IELTS nếu cần.' },
                { time: 'T9 - T10 năm trước', title: 'Nộp đơn xin học', desc: 'Hoàn thiện hồ sơ xin nhập học. Nộp qua website trường hoặc gửi bản cứng.' },
                { time: 'T11 - T12 năm trước', title: 'Nhận kết quả', desc: 'Nhận thư mời nhập học. Chuẩn bị sổ tiết kiệm và hồ sơ tài chính.' },
                { time: 'T1 cùng năm', title: 'Xin visa', desc: 'Nộp hồ sơ xin visa D-2/D-4 tại ĐSQ Hàn Quốc. Chuẩn bị hành lý.' },
                { time: 'Đầu tháng 3', title: '✈️ Lên đường!', desc: 'Bay sang Hàn Quốc. Làm thủ tục nhập học, đăng ký cư trú.' }
            ]
        },
        fall: {
            label: '🍂 Kỳ tháng 9 (Thu)',
            timeline: [
                { time: 'T9 - T12 năm trước', title: 'Định hướng', desc: 'Chọn trường, ngành học. Bắt đầu học tiếng Hàn hoặc luyện thi IELTS.' },
                { time: 'T1 - T2 cùng năm', title: 'Chuẩn bị hồ sơ', desc: 'Thu thập giấy tờ, dịch thuật công chứng. Thi TOPIK/IELTS.' },
                { time: 'T3 - T4 cùng năm', title: 'Nộp đơn xin học', desc: 'Hoàn thiện hồ sơ xin nhập học. Nộp đúng hạn.' },
                { time: 'T5 - T6 cùng năm', title: 'Nhận kết quả', desc: 'Nhận thư mời. Mở sổ tiết kiệm (tối thiểu 3 tháng trước).' },
                { time: 'T7 - T8 cùng năm', title: 'Xin visa', desc: 'Nộp hồ sơ visa. Mua vé máy bay, chuẩn bị hành lý.' },
                { time: 'Đầu tháng 9', title: '✈️ Lên đường!', desc: 'Bay sang Hàn Quốc. Nhập học và khám phá cuộc sống mới.' }
            ]
        }
    },

    init() {
        if (!document.querySelector('.dossier-sidebar')) return;
        this.renderDocuments('personal', 'dossier-personal', ['🪪', '📄', '🏠', '👶', '📸', '📋']);
        this.renderDocuments('education', 'dossier-education', ['🎓', '📊', '📜', '🇰🇷', '📖', '✉️']);
        this.renderDocuments('finance', 'dossier-finance', ['🏦', '💼', '🏠', '📝']);
        this.renderDocuments('health', 'dossier-health', ['🏥', '🔬', '🛡️']);
        this.renderTimeline('spring');
        this.updateProgress();
    },

    renderDocuments(category, containerId, icons) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const docs = this.documents[category];
        const saved = this.getProgress();

        container.innerHTML = docs.map((doc, i) => {
            const status = saved[doc.id] || 'pending';
            const statusClass = status === 'done' ? 'status-done' : status === 'progress' ? 'status-progress' : 'status-todo';
            const statusText = status === 'done' ? '✅ Đã xong' : status === 'progress' ? '🔄 Đang làm' : '⏳ Chưa làm';
            const cardClass = status === 'done' ? 'completed' : status === 'progress' ? 'in-progress' : 'pending';

            return `
                <div class="doc-card ${cardClass}">
                    <div class="doc-header">
                        <div class="doc-icon" style="background:var(--bg-tertiary);">${icons[i] || '📄'}</div>
                        <div class="doc-info">
                            <h4>${doc.title}</h4>
                            <p>${doc.desc}</p>
                        </div>                            <select data-doc-id="${doc.id}" onchange="DossierApp.updateDocStatus(this.dataset.docId, this.value)" style="padding:4px 8px; border:2px solid var(--border); border-radius:var(--radius-sm); font-size:0.78rem; font-family:inherit;">
                            <option value="pending" ${status === 'pending' ? 'selected' : ''}>⏳ Chưa làm</option>
                            <option value="progress" ${status === 'progress' ? 'selected' : ''}>🔄 Đang làm</option>
                            <option value="done" ${status === 'done' ? 'selected' : ''}>✅ Đã xong</option>
                        </select>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="doc-toggle" onclick="DossierApp.toggleDetail(this)">📖 Xem hướng dẫn ▼</span>
                    </div>
                    <div class="doc-detail">${doc.details}</div>
                </div>
            `;
        }).join('');
    },

    toggleDetail(el) {
        const card = el.closest('.doc-card');
        card.classList.toggle('expanded');
        el.textContent = card.classList.contains('expanded') ? '📖 Ẩn hướng dẫn ▲' : '📖 Xem hướng dẫn ▼';
    },

    getProgress() {
        try { return JSON.parse(localStorage.getItem('tth_dossier')) || {}; }
        catch { return {}; }
    },

    saveProgress(data) {
        localStorage.setItem('tth_dossier', JSON.stringify(data));
    },

    updateDocStatus(id, status) {
        const saved = this.getProgress();
        saved[id] = status;
        this.saveProgress(saved);
        // Update card UI via data attribute
        const select = document.querySelector(`select[data-doc-id="${id}"]`);
        const card = select?.closest('.doc-card');
        if (card) {
            card.className = 'doc-card ' + (status === 'done' ? 'completed' : status === 'progress' ? 'in-progress' : 'pending');
        }
        this.updateProgress();
    },

    updateProgress() {
        const allDocs = [...this.documents.personal, ...this.documents.education, ...this.documents.finance, ...this.documents.health];
        const total = allDocs.length;
        const saved = this.getProgress();
        const done = Object.values(saved).filter(s => s === 'done').length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        const ring = document.getElementById('progressRing');
        const number = document.getElementById('progressNumber');
        if (ring) ring.style.setProperty('--progress', progress + '%');
        if (number) number.textContent = progress + '%';
    },

    resetProgress() {
        if (!confirm('Bạn có chắc muốn đặt lại toàn bộ tiến độ hồ sơ?')) return;
        localStorage.removeItem('tth_dossier');
        this.init();
    },

    renderTimeline(semester) {
        const container = document.getElementById('timelineContent');
        if (!container) return;

        const data = this.semesters[semester];
        container.innerHTML = `
            <h4 style="margin-bottom:16px;">${data.label}</h4>
            <div class="timeline">
                ${data.timeline.map(item => `
                    <div class="timeline-item">
                        <div style="font-size:0.78rem; color:var(--primary); font-weight:600; margin-bottom:2px;">${item.time}</div>
                        <h4>${item.title}</h4>
                        <p>${item.desc}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    switchSemester(semester, btn) {
        document.querySelectorAll('.semester-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.renderTimeline(semester);
    },

    showTemplate(id) {
        const tpl = this.templates[id];
        if (!tpl) return;
        document.getElementById('templateTitle').textContent = tpl.title;
        document.getElementById('templateContent').innerHTML = tpl.content;
        document.getElementById('templateModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    closeTemplate() {
        document.getElementById('templateModal').style.display = 'none';
        document.body.style.overflow = '';
    }
};

document.addEventListener('DOMContentLoaded', () => DossierApp.init());
