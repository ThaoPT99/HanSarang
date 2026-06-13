/* ==========================================
   THÔNG TIN TRƯỜNG HÀN - Features Module
   Quiz, Blog, Reviews, Wishlist, Q&A
   ========================================== */

// ===== UTILITY =====
const Storage = {
    get(key, def = null) {
        try { const d = localStorage.getItem('tth_' + key); return d ? JSON.parse(d) : def; }
        catch { return def; }
    },
    set(key, val) { try { localStorage.setItem('tth_' + key, JSON.stringify(val)); } catch {} }
};

// ===== FEATURE 1: QUIZ TÌM TRƯỜNG PHÙ HỢP =====
const QuizApp = {
    questions: [
        {
            id: 'goal',
            question: 'Mục tiêu du học của bạn là gì?',
            icon: '🎯',
            options: [
                { value: 'undergrad', label: 'Học Đại học (Cử nhân)', desc: 'Tốt nghiệp THPT, muốn lấy bằng cử nhân tại Hàn' },
                { value: 'grad', label: 'Học Sau đại học (Thạc sĩ)', desc: 'Đã tốt nghiệp ĐH, muốn học lên Thạc sĩ' },
                { value: 'language', label: 'Học tiếng Hàn trước', desc: 'Học tiếng tại viện ngôn ngữ, sau đó vào ĐH' },
                { value: 'exchange', label: 'Trao đổi sinh viên', desc: 'Chương trình trao đổi 1-2 kỳ từ trường ĐH tại VN' }
            ]
        },
        {
            id: 'gpa',
            question: 'Học lực hiện tại của bạn (GPA)?',
            icon: '📚',
            options: [
                { value: 'high', label: 'Xuất sắc (8.0+/10)', desc: 'Cơ hội săn học bổng cao, có thể apply trường top' },
                { value: 'good', label: 'Khá (7.0-7.9/10)', desc: 'Đủ điều kiện hầu hết các trường, có học bổng 30-50%' },
                { value: 'average', label: 'Trung bình (6.0-6.9/10)', desc: 'Phù hợp trường vừa phải, cần chứng minh năng lực khác' },
                { value: 'low', label: 'Dưới 6.0/10', desc: 'Cần học tiếng Hàn trước, apply trường yêu cầu thấp hơn' }
            ]
        },
        {
            id: 'topik',
            question: 'Trình độ tiếng Hàn của bạn?',
            icon: '🇰🇷',
            options: [
                { value: 'topik4', label: 'TOPIK 4 trở lên', desc: 'Đủ điều kiện apply thẳng vào ĐH, kể cả trường top' },
                { value: 'topik3', label: 'TOPIK 3', desc: 'Đủ điều kiện vào nhiều trường ĐH, cần học thêm' },
                { value: 'beginner', label: 'Biết cơ bản (đang học)', desc: 'Cần học thêm 6-12 tháng tại Hàn trước khi vào ĐH' },
                { value: 'none', label: 'Chưa biết gì', desc: 'Có thể học tiếng tại Hàn từ đầu (visa D-4)' }
            ]
        },
        {
            id: 'budget',
            question: 'Ngân sách dự kiến mỗi năm?',
            icon: '💰',
            options: [
                { value: 'high', label: 'Trên 15,000 USD', desc: 'Thoải mái tài chính, có thể học trường top tại Seoul' },
                { value: 'medium', label: '10,000 - 15,000 USD', desc: 'Đủ chi trả học phí + sinh hoạt tại thành phố lớn' },
                { value: 'low', label: '7,000 - 10,000 USD', desc: 'Cần chọn trường công lập hoặc ở tỉnh để tiết kiệm' },
                { value: 'scholarship', label: 'Cần học bổng tối đa', desc: 'Ưu tiên trường có học bổng cao, hoặc apply GKS' }
            ]
        },
        {
            id: 'region',
            question: 'Khu vực bạn muốn học?',
            icon: '📍',
            options: [
                { value: 'seoul', label: 'Seoul', desc: 'Chi phí cao nhất nhưng nhiều trường top, nhiều cơ hội' },
                { value: 'busan', label: 'Busan hoặc thành phố lớn', desc: 'Chi phí trung bình, chất lượng tốt' },
                { value: 'province', label: 'Tỉnh (Gyeonggi, Gangwon...)', desc: 'Chi phí thấp, môi trường yên tĩnh, phù hợp học tập' },
                { value: 'any', label: 'Không quan trọng', desc: 'Miễn là trường tốt, học bổng cao' }
            ]
        }
    ],

    currentStep: 0,
    answers: {},

    init() {
        // Check if quiz container exists
        if (!$('quizModal')) return;

        this.currentStep = 0;
        this.answers = {};
        this.renderStep();
        this.bindEvents();
    },

    bindEvents() {
        // Close modal
        document.querySelectorAll('.quiz-close, .quiz-overlay').forEach(el => {
            el?.addEventListener('click', () => this.close());
        });
    },

    open() {
        const modal = $('quizModal');
        if (modal) {
            this.currentStep = 0;
            this.answers = {};
            this.renderStep();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    close() {
        const modal = $('quizModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    renderStep() {
        const step = this.questions[this.currentStep];
        if (!step) { this.showResults(); return; }

        const container = $('quizContent');
        if (!container) return;

        // Progress
        const progress = ((this.currentStep) / this.questions.length) * 100;

        container.innerHTML = `
            <div class="quiz-progress">
                <div class="quiz-progress-bar" style="width: ${progress}%"></div>
                <div class="quiz-step-indicator">Bước ${this.currentStep + 1}/${this.questions.length}</div>
            </div>
            <div class="quiz-question">
                <div class="quiz-question-icon">${step.icon}</div>
                <h3>${step.question}</h3>
            </div>
            <div class="quiz-options" id="quizOptions">
                ${step.options.map((opt, i) => `
                    <div class="quiz-option" onclick="QuizApp.selectOption('${opt.value}')" data-value="${opt.value}">
                        <div class="quiz-option-label">${opt.label}</div>
                        <div class="quiz-option-desc">${opt.desc}</div>
                    </div>
                `).join('')}
            </div>
            <div class="quiz-nav">
                ${this.currentStep > 0 ? `<button class="btn btn-secondary btn-sm" onclick="QuizApp.prevStep()">← Quay lại</button>` : '<div></div>'}
            </div>
        `;
    },

    selectOption(value) {
        this.answers[this.questions[this.currentStep].id] = value;
        // Highlight selected
        document.querySelectorAll('.quiz-option').forEach(el => {
            el.classList.toggle('selected', el.dataset.value === value);
        });
        // Disable further clicks on this step
        document.querySelectorAll('.quiz-option').forEach(el => {
            el.style.pointerEvents = 'none';
        });
        // Auto advance after delay
        setTimeout(() => {
            this.currentStep++;
            if (this.currentStep >= this.questions.length) {
                this.showResults();
            } else {
                this.renderStep();
            }
        }, 600);
    },

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    },

    showResults() {
        const container = $('quizContent');
        if (!container) return;

        container.innerHTML = `
            <div class="quiz-progress">
                <div class="quiz-progress-bar" style="width: 100%"></div>
            </div>
            <div style="text-align:center; padding: 20px 0;">
                <div style="font-size: 4rem; margin-bottom: 16px;">🎉</div>
                <h3 style="margin-bottom: 8px;">Đã tìm thấy trường phù hợp!</h3>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Dựa trên câu trả lời của bạn, đây là những trường phù hợp nhất</p>
                <div id="quizResults" style="text-align:left; max-height: 400px; overflow-y: auto;"></div>
                <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="QuizApp.close()">Xem chi tiết</button>
                    <button class="btn btn-secondary" onclick="QuizApp.saveAndSubscribe()" style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-envelope"></i> Gửi kết quả qua email
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="QuizApp.restart()">Làm lại</button>
                </div>
                <div id="quizSubscribeForm" style="display:none; margin-top: 16px;">
                    <div style="display: flex; gap: 8px; max-width: 400px; margin: 0 auto;">
                        <input type="email" id="quizEmail" placeholder="Nhập email của bạn..." style="flex:1; padding: 10px 14px; border: 2px solid var(--border); border-radius: var(--radius-md); font-family: inherit;">
                        <button class="btn btn-primary btn-sm" onclick="QuizApp.subscribe()">Nhận kết quả</button>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">Nhập email để nhận danh sách trường + tài liệu du học miễn phí</p>
                </div>
            </div>
        `;

        // Find matching universities
        const matches = this.findMatches();
        const resultsEl = $('quizResults');
        if (resultsEl) {
            resultsEl.innerHTML = matches.length
                ? matches.slice(0, 6).map(u => `
                    <div class="quiz-result-item" onclick="window.location.href='chi-tiet-truong.html?id=${u.id}'">
                        <div class="quiz-result-info">
                            <strong>${u.name}</strong>
                            <span>${u.region} · ${u.type} · ${u.tier}</span>
                        </div>
                        <span style="color: var(--primary); font-weight: 600; white-space: nowrap;">${u.tuition}</span>
                    </div>
                `).join('')
                : '<p style="text-align:center; color: var(--text-muted);">Không tìm thấy trường. Thử điều chỉnh lại tiêu chí.</p>';
        }
    },

    findMatches() {
        const { goal, gpa, topik, budget, region } = this.answers;
        let filtered = [...universities];

        // Filter by goal
        if (goal === 'language') {
            filtered = filtered.filter(u => u.type === 'Trung tâm Ngôn ngữ' || u.tags.includes('ngon-ngu'));
        } else if (goal === 'undergrad' || goal === 'grad') {
            filtered = filtered.filter(u => u.type !== 'Trung tâm Ngôn ngữ');
        }

        // Filter by GPA
        if (gpa === 'high') {
            // Show all, but prioritize SKY/top
            filtered.sort((a, b) => (b.tier === 'SKY' ? 1 : 0) - (a.tier === 'SKY' ? 1 : 0));
        } else if (gpa === 'low') {
            filtered = filtered.filter(u => u.ranking > 20 || u.tags.includes('hoc-phi-thap') || u.type === 'Trung tâm Ngôn ngữ');
        }

        // Filter by TOPIK
        if (topik === 'none' || topik === 'beginner') {
            filtered = filtered.filter(u => u.topikRequired.includes('Không yêu cầu') || u.type === 'Trung tâm Ngôn ngữ');
        } else if (topik === 'topik3') {
            filtered = filtered.filter(u => u.topikRequired.includes('TOPIK 3') || u.topikRequired.includes('TOPIK 3-4') || u.type === 'Trung tâm Ngôn ngữ');
        }

        // Filter by budget
        if (budget === 'low') {
            filtered = filtered.filter(u => u.tags.includes('hoc-phi-thap') || u.type === 'Trung tâm Ngôn ngữ');
        } else if (budget === 'scholarship') {
            filtered = filtered.filter(u => u.tags.includes('hoc-bong-gks') || u.tags.includes('hoc-bong-toan-phan'));
        }

        // Filter by region
        if (region === 'seoul') {
            filtered = filtered.filter(u => u.region === 'Seoul');
        } else if (region === 'busan') {
            filtered = filtered.filter(u => ['Busan', 'Daegu', 'Daejeon', 'Ulsan', 'Gwangju'].includes(u.region));
        } else if (region === 'province') {
            filtered = filtered.filter(u => !['Seoul', 'Busan', 'Daegu', 'Daejeon'].includes(u.region));
        }

        return filtered;
    },

    saveAndSubscribe() {
        const form = $('quizSubscribeForm');
        if (form) form.style.display = 'block';
    },

    subscribe() {
        const email = $('quizEmail')?.value;
        if (!email || !email.includes('@')) {
            alert('Vui lòng nhập email hợp lệ!');
            return;
        }
        // Save subscriber
        const subs = Storage.get('subscribers', []);
        if (!subs.includes(email)) {
            subs.push(email);
            Storage.set('subscribers', subs);
        }
        alert('✅ Cảm ơn bạn! Chúng tôi sẽ gửi danh sách trường và tài liệu du học đến email ' + email);
        this.close();
    },

    restart() {
        this.currentStep = 0;
        this.answers = {};
        this.renderStep();
    }
};

// ===== FEATURE 2: BLOG & TIN TỨC =====
const BlogApp = {
    posts: [
        {
            id: 'gks-2026',
            title: 'Học bổng GKS 2026: Hướng dẫn chi tiết từ A-Z cho sinh viên Việt Nam',
            excerpt: 'Học bổng toàn phần Chính phủ Hàn Quốc (GKS) đã mở đơn cho kỳ 2026. Tìm hiểu điều kiện, hồ sơ, kinh nghiệm phỏng vấn và cách tăng cơ hội đậu.',
            category: 'hoc-bong',
            tags: ['GKS', 'học bổng', 'chính phủ'],
            image: '🎓',
            author: 'Thông Tin Trường Hàn',
            date: '2026-01-15',
            readTime: '8 phút',
            featured: true,
            content: `
                <h3>1. Học bổng GKS là gì?</h3>
                <p>Học bổng Global Korea Scholarship (GKS) là chương trình học bổng toàn phần danh giá nhất của Chính phủ Hàn Quốc dành cho sinh viên quốc tế. Học bổng bao gồm: 100% học phí, vé máy bay khứ hồi, sinh hoạt phí (khoảng 1,000 USD/tháng), bảo hiểm y tế, và phí định cư.</p>
                
                <h3>2. Đối tượng và điều kiện</h3>
                <ul>
                    <li><strong>Công dân Việt Nam</strong>, không có quốc tịch Hàn Quốc</li>
                    <li><strong>Độ tuổi:</strong> Dưới 25 tuổi (hệ Cử nhân), dưới 40 tuổi (hệ Sau đại học)</li>
                    <li><strong>GPA:</strong> Từ 7.5/10 trở lên (tương đương 2.64/4.0)</li>
                    <li><strong>TOPIK:</strong> Không bắt buộc khi nộp, nhưng có lợi thế rất lớn</li>
                    <li><strong>IELTS:</strong> 6.0+ hoặc TOEFL 80+ (bắt buộc với chương trình tiếng Anh)</li>
                </ul>

                <div class="info-box">
                    <p><strong>💡 Mẹo quan trọng:</strong> Tỷ lệ đậu GKS rất cạnh tranh (khoảng 5-10%). Để tăng cơ hội, bạn nên có GPA 8.0+, TOPIK 4+ và hoạt động ngoại khóa nổi bật. Hãy chuẩn bị hồ sơ từ 6-12 tháng trước hạn nộp.</p>
                </div>

                <h3>3. Các mốc thời gian quan trọng</h3>
                <table>
                    <tr><th>Giai đoạn</th><th>Thời gian</th></tr>
                    <tr><td>Mở đơn</td><td>Tháng 2 - Tháng 3</td></tr>
                    <tr><td>Hạn nộp hồ sơ</td><td>Cuối tháng 3</td></tr>
                    <tr><td>Vòng sơ loại (ĐSQ/Lãnh sự)</td><td>Tháng 4</td></tr>
                    <tr><td>Phỏng vấn</td><td>Tháng 4 - 5</td></tr>
                    <tr><td>Công bố kết quả</td><td>Tháng 6 - 7</td></tr>
                    <tr><td>Nhập học</td><td>Tháng 9</td></tr>
                </table>

                <h3>4. Hồ sơ cần chuẩn bị</h3>
                <ol>
                    <li>Đơn xin học bổng GKS (theo mẫu)</li>
                    <li>Bảng điểm và bằng tốt nghiệp (dịch thuật công chứng)</li>
                    <li>Chứng chỉ ngoại ngữ (TOPIK, IELTS, TOEFL)</li>
                    <li>Thư giới thiệu (2-3 thư từ giáo sư/người quản lý)</li>
                    <li>Kế hoạch học tập (Study Plan) - RẤT QUAN TRỌNG</li>
                    <li>Giấy khám sức khỏe</li>
                    <li>Hộ chiếu</li>
                </ol>

                <div class="info-box">
                    <p><strong>⚠️ Lưu ý:</strong> Nộp hồ sơ qua 2 kênh: Đại sứ quán Hàn Quốc tại Việt Nam HOẶC trực tiếp qua trường đại học tại Hàn. Mỗi kênh có ưu nhược điểm riêng. Bạn có thể nộp cả 2 để tăng cơ hội.</p>
                </div>
            `
        },
        {
            id: 'visa-d2-2026',
            title: 'Cập nhật quy định visa du học Hàn Quốc 2026: Những thay đổi quan trọng',
            excerpt: 'Từ năm 2026, Hàn Quốc áp dụng nhiều thay đổi mới về visa du học. Tìm hiểu ngay để tránh bị từ chối visa đáng tiếc.',
            category: 'visa',
            tags: ['visa', 'D-2', 'D-4', 'thủ tục'],
            image: '🛂',
            author: 'Thông Tin Trường Hàn',
            date: '2026-01-10',
            readTime: '5 phút',
            featured: true,
            content: `
                <h3>Những thay đổi quan trọng về visa du học Hàn Quốc 2026</h3>
                <p>Từ đầu năm 2026, Chính phủ Hàn Quốc đã cập nhật một số quy định mới về visa du học mà sinh viên Việt Nam cần đặc biệt lưu ý.</p>
                
                <h3>1. Hệ thống xét duyệt trường (University Certification)</h3>
                <p>Hàn Quốc tiếp tục siết chặt hệ thống đánh giá trường. Chỉ những trường đạt chứng nhận mới được cấp visa D-2 thuận lợi. Sinh viên nên kiểm tra trường mình chọn có nằm trong danh sách được chứng nhận không.</p>
                
                <h3>2. Yêu cầu tài chính tăng nhẹ</h3>
                <p>Số dư sổ tiết kiệm yêu cầu đã tăng nhẹ. Đối với khu vực Seoul: tối thiểu 12,000 USD, các khu vực khác: 10,000 USD. Sổ tiết kiệm cần được mở trước ít nhất 3 tháng.</p>
                
                <h3>3. Bảo hiểm y tế bắt buộc</h3>
                <p>Tất cả du học sinh lưu trú trên 6 tháng phải tham gia bảo hiểm y tế quốc gia (NHIS) từ ngày đầu nhập cảnh, mức phí khoảng 65 USD/tháng.</p>

                <div class="info-box">
                    <p><strong>💡 Lời khuyên:</strong> Luôn kiểm tra thông tin mới nhất trên website của Đại sứ quán Hàn Quốc tại Việt Nam hoặc gọi hotline để được tư vấn trực tiếp.</p>
                </div>
            `
        },
        {
            id: 'cuoc-song-sinh-vien',
            title: 'Một ngày của du học sinh Việt Nam tại Seoul: Chi phí, nhịp sống và những điều cần biết',
            excerpt: 'Bỏ túi kinh nghiệm thực tế về chi phí sinh hoạt, nhà ở, ăn uống và làm thêm tại Seoul từ du học sinh Việt Nam đang học tại Đại học Korea.',
            category: 'cuoc-song',
            tags: ['kinh nghiệm', 'Seoul', 'chi phí'],
            image: '🏠',
            author: 'Minh Anh - Du học sinh ĐH Korea',
            date: '2026-01-05',
            readTime: '6 phút',
            featured: true,
            content: `
                <h3>Lời mở đầu</h3>
                <p>Mình là Minh Anh, hiện đang học năm 2 ngành Kinh tế tại Đại học Korea (Korea University). Hôm nay mình sẽ chia sẻ một ngày điển hình và chi phí thực tế để các bạn có cái nhìn chân thực nhất về cuộc sống du học sinh tại Seoul.</p>
                
                <h3>Buổi sáng</h3>
                <p>Mình thức dậy lúc 7h sáng. Tiền nhà mình ở goshiwon gần trường: 450,000 won/tháng (khoảng 340 USD). Bữa sáng mình tự nấu: 2,000-3,000 won.</p>
                
                <h3>Buổi trưa</h3>
                <p>Ăn trưa tại căn tin trường: 4,000-6,000 won/suất. Căn tin trường Korea rẻ và ngon, có nhiều lựa chọn.</p>
                
                <h3>Buổi chiều - Làm thêm</h3>
                <p>Mình làm thêm tại quán cà phê gần trường, 4 tiếng/ngày, lương 10,000 won/giờ. Một tháng kiếm được khoảng 800,000-1,000,000 won ($600-750). Các bạn nhớ xin giấy phép làm thêm từ trường trước nhé!</p>
                
                <h3>Chi phí hàng tháng thực tế</h3>
                <table>
                    <tr><th>Khoản mục</th><th>Chi phí (won)</th><th>Chi phí (USD)</th></tr>
                    <tr><td>Nhà ở</td><td>450,000</td><td>340</td></tr>
                    <tr><td>Ăn uống</td><td>350,000</td><td>265</td></tr>
                    <tr><td>Di chuyển</td><td>60,000</td><td>45</td></tr>
                    <tr><td>Điện thoại + Internet</td><td>50,000</td><td>38</td></tr>
                    <tr><td>Bảo hiểm y tế</td><td>80,000</td><td>60</td></tr>
                    <tr><td>Chi tiêu khác</td><td>100,000</td><td>75</td></tr>
                    <tr><td><strong>Tổng</strong></td><td><strong>1,090,000</strong></td><td><strong>823</strong></td></tr>
                </table>
                
                <div class="info-box">
                    <p><strong>💡 Lời khuyên:</strong> Nếu bạn ở ký túc xá sẽ rẻ hơn (khoảng 300,000 won/tháng), nhưng mình thích goshiwon vì có không gian riêng. Làm thêm giúp trang trải sinh hoạt phí, nhưng đừng để ảnh hưởng đến việc học nhé!</p>
                </div>
            `
        },
        {
            id: 'chon-nganh-hoc',
            title: 'Top 10 ngành học "hot" tại Hàn Quốc năm 2026: Cơ hội việc làm sau tốt nghiệp',
            excerpt: 'Phân tích chi tiết các ngành học có nhu cầu nhân lực cao tại Hàn Quốc, cơ hội việc làm và mức lương sau khi tốt nghiệp.',
            category: 'huong-nghiep',
            tags: ['ngành học', 'việc làm', 'xu hướng'],
            image: '💼',
            author: 'Thông Tin Trường Hàn',
            date: '2025-12-28',
            readTime: '7 phút',
            featured: false,
            content: `
                <h3>10 ngành học triển vọng tại Hàn Quốc</h3>
                <p>Dưới đây là những ngành học có cơ hội việc làm cao nhất tại Hàn Quốc, dựa trên dữ liệu thị trường lao động và xu hướng phát triển kinh tế.</p>
                
                <h3>1. Khoa học máy tính & AI</h3>
                <p>Nhu cầu nhân lực cực cao tại các tập đoàn công nghệ (Samsung, LG, Naver, Kakao). Mức lương khởi điểm: 40-50 triệu won/năm ($30,000-38,000).</p>
                
                <h3>2. Kỹ thuật bán dẫn</h3>
                <p>Hàn Quốc là cường quốc bán dẫn. Samsung Electronics và SK Hynix liên tục tuyển dụng. Đây là ngành được chính phủ ưu tiên đầu tư.</p>
                
                <h3>3. Kinh doanh quốc tế</h3>
                <p>Phù hợp với sinh viên Việt Nam muốn làm việc tại các công ty Hàn Quốc có đầu tư vào Việt Nam hoặc ngược lại.</p>
            `
        },
        {
            id: 'san-hoc-bong',
            title: 'Kinh nghiệm săn học bổng toàn phần Đại học Hàn Quốc: Câu chuyện từ người trong cuộc',
            excerpt: 'Bí quyết săn học bổng 100% từ một cựu du học sinh Việt Nam đã tốt nghiệp Đại học Yonsei với học bổng toàn phần.',
            category: 'hoc-bong',
            tags: ['học bổng', 'Yonsei', 'kinh nghiệm'],
            image: '🏆',
            author: 'Hoàng Nam - Cựu SV ĐH Yonsei',
            date: '2025-12-20',
            readTime: '6 phút',
            featured: false,
            content: `
                <h3>Hành trình săn học bổng của mình</h3>
                <p>Xin chào các bạn, mình là Hoàng Nam, cựu sinh viên ngành Quan hệ quốc tế tại Đại học Yonsei (học bổng 100% học phí 4 năm). Hôm nay mình sẽ chia sẻ kinh nghiệm săn học bổng để các bạn có thể áp dụng.</p>
                
                <h3>1. Chuẩn bị từ sớm</h3>
                <p>Mình bắt đầu chuẩn bị từ năm lớp 10: tập trung học để có GPA cao (mình đạt 9.2/10), học tiếng Anh (IELTS 7.5), và bắt đầu học tiếng Hàn từ lớp 11.</p>
                
                <h3>2. Bài luận - Chìa khóa thành công</h3>
                <p>Theo mình, bài luận là phần quan trọng nhất. Đừng viết chung chung. Hãy kể câu chuyện của RIÊNG BẠN: tại sao bạn muốn học ngành này? Tại sao lại chọn Hàn Quốc? Bạn sẽ đóng góp gì?</p>
                
                <h3>3. Phỏng vấn</h3>
                <p>Hãy tự tin, trung thực và thể hiện đam mê. Mình đã luyện phỏng vấn với giáo viên tiếng Anh và bạn bè trước khi phỏng vấn thật.</p>
            `
        },
        {
            id: 'so-sanh-visa',
            title: 'Visa D-2 vs D-4: Nên chọn loại visa nào cho lộ trình du học Hàn Quốc?',
            excerpt: 'So sánh chi tiết visa D-2 (du học chính khóa) và D-4 (học tiếng): ưu nhược điểm, quyền lợi, và lộ trình phù hợp cho từng đối tượng.',
            category: 'visa',
            tags: ['visa', 'D-2', 'D-4'],
            image: '📋',
            author: 'Thông Tin Trường Hàn',
            date: '2025-12-15',
            readTime: '5 phút',
            featured: false,
            content: `
                <h3>So sánh visa D-2 và D-4</h3>
                <p>Việc chọn đúng loại visa ngay từ đầu rất quan trọng. Dưới đây là so sánh chi tiết giữa hai loại visa phổ biến nhất.</p>
                
                <table>
                    <tr><th>Tiêu chí</th><th>Visa D-4 (Học tiếng)</th><th>Visa D-2 (Chính khóa)</th></tr>
                    <tr><td>Mục đích</td><td>Học tiếng Hàn tại viện ngôn ngữ</td><td>Học Đại học/Cao học/Sau đại học</td></tr>
                    <tr><td>Thời hạn</td><td>6 tháng - 2 năm</td><td>2-4 năm (tùy bậc học)</td></tr>
                    <tr><td>Làm thêm</td><td>Sau 6 tháng (có giới hạn)</td><td>Sau 6 tháng (20h/tuần kỳ học)</td></tr>
                    <tr><td>Chuyển đổi</td><td>Có thể chuyển sang D-2</td><td>Có thể gia hạn hoặc chuyển D-10</td></tr>
                </table>
            `
        }
    ],

    getCategoryName(cat) {
        const names = {
            'hoc-bong': '🎓 Học bổng',
            'visa': '🛂 Visa & Thủ tục',
            'cuoc-song': '🏠 Cuộc sống',
            'huong-nghiep': '💼 Hướng nghiệp'
        };
        return names[cat] || cat;
    },

    init() {
        const listingEl = $('blogList');
        if (listingEl) this.renderListing();

        const detailEl = $('blogDetail');
        if (detailEl) this.renderDetail();

        const sidebarEl = $('blogSidebar');
        if (sidebarEl) this.renderSidebar();
    },

    renderListing() {
        const el = $('blogList');
        if (!el) return;

        const category = getQueryParam('category') || 'all';
        const filtered = category === 'all' ? this.posts : this.posts.filter(p => p.category === category);

        el.innerHTML = filtered.map(post => `
            <div class="blog-card" onclick="window.location.href='bai-viet.html?id=${post.id}'">
                <div class="blog-card-image">${post.image}</div>
                <div class="blog-card-body">
                    <div class="blog-card-meta">
                        <span class="blog-category">${this.getCategoryName(post.category)}</span>
                        <span>${post.date} · ${post.readTime}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="blog-card-footer">
                        <span>✍️ ${post.author}</span>
                        <span class="blog-read-more">Đọc tiếp →</span>
                    </div>
                </div>
            </div>
        `).join('') || '<p style="text-align:center; color: var(--text-muted); padding: 40px;">Chưa có bài viết nào trong chuyên mục này</p>';

        // Highlight category
        document.querySelectorAll('.blog-cat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === category);
        });
    },

    renderDetail() {
        const el = $('blogDetail');
        if (!el) return;

        const id = getQueryParam('id');
        const post = this.posts.find(p => p.id === id);

        if (!post) {
            el.innerHTML = '<p style="text-align:center; padding: 40px;">Không tìm thấy bài viết</p>';
            return;
        }

        document.title = `${post.title} - Thông Tin Trường Hàn`;

        // Update SEO meta tags and inject Article JSON-LD
        const blogDesc = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160);
        document.getElementById('blogTitle')?.textContent = `${post.title} - Thông Tin Trường Hàn`;
        document.getElementById('blogDesc')?.setAttribute('content', blogDesc);
        document.getElementById('blogCanonical')?.setAttribute('href', `https://hansarang.vercel.app/bai-viet.html?id=${post.id}`);
        document.getElementById('ogBlogTitle')?.setAttribute('content', post.title);
        document.getElementById('ogBlogDesc')?.setAttribute('content', blogDesc);
        document.getElementById('twBlogTitle')?.setAttribute('content', post.title);

        // Inject Article JSON-LD
        const articleScript = document.createElement('script');
        articleScript.type = 'application/ld+json';
        articleScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": blogDesc,
            "author": {
                "@type": "Person",
                "name": post.author
            },
            "datePublished": post.date,
            "publisher": {
                "@type": "Organization",
                "name": "Thông Tin Trường Hàn"
            }
        });
        document.head.appendChild(articleScript);

        el.innerHTML = `
            <div class="blog-detail-header">
                <div class="blog-detail-image">${post.image}</div>
                <div class="blog-detail-meta">
                    <span class="blog-category">${this.getCategoryName(post.category)}</span>
                    <span>${post.date}</span>
                    <span>${post.readTime}</span>
                </div>
                <h1>${post.title}</h1>
                <p class="blog-detail-author">✍️ ${post.author}</p>
            </div>
            <div class="blog-detail-content">
                ${post.content}
            </div>
            <div class="blog-detail-share">
                <span>Chia sẻ bài viết:</span>
                <button onclick="alert('Chia sẻ Facebook - tính năng đang phát triển')" class="btn btn-sm btn-secondary"><i class="fab fa-facebook"></i></button>
                <button onclick="alert('Sao chép link - tính năng đang phát triển')" class="btn btn-sm btn-secondary"><i class="fas fa-link"></i></button>
            </div>
        `;
    },

    renderSidebar() {
        const el = $('blogSidebar');
        if (!el) return;

        el.innerHTML = `
            <div class="sidebar-card">
                <h3>Chuyên mục</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <a href="blog.html" class="blog-cat-btn ${!getQueryParam('category') || getQueryParam('category') === 'all' ? 'active' : ''}" data-cat="all" style="padding: 8px 12px; border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 0.9rem;">📋 Tất cả bài viết</a>
                    ${['hoc-bong', 'visa', 'cuoc-song', 'huong-nghiep'].map(cat => `
                        <a href="blog.html?category=${cat}" class="blog-cat-btn ${getQueryParam('category') === cat ? 'active' : ''}" data-cat="${cat}" style="padding: 8px 12px; border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 0.9rem;">${this.getCategoryName(cat)}</a>
                    `).join('')}
                </div>
            </div>
            <div class="sidebar-card">
                <h3>Bài viết nổi bật</h3>
                ${this.posts.filter(p => p.featured).slice(0, 3).map(p => `
                    <div onclick="window.location.href='bai-viet.html?id=${p.id}'" style="cursor:pointer; padding: 12px 0; border-bottom: 1px solid var(--border-light);">
                        <div style="font-size:0.85rem; color: var(--text-muted);">${p.date}</div>
                        <div style="font-size:0.9rem; font-weight:500; margin-top:4px;">${p.title.substring(0, 60)}...</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

// ===== FEATURE 3: REVIEW & ĐÁNH GIÁ =====
const ReviewSystem = {
    getReviews(universityId) {
        const all = Storage.get('reviews', {});
        return all[universityId] || [];
    },

    saveReview(universityId, review) {
        const all = Storage.get('reviews', {});
        if (!all[universityId]) all[universityId] = [];
        review.id = Date.now().toString();
        review.date = new Date().toISOString().split('T')[0];
        review.likes = 0;
        all[universityId].push(review);
        Storage.set('reviews', all);
        return review;
    },

    getAverageRating(universityId) {
        const reviews = this.getReviews(universityId);
        if (reviews.length === 0) return 0;
        return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    },

    getRatingCount(universityId) {
        return this.getReviews(universityId).length;
    },

    renderStars(rating, interactive = false, containerId = null) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= rating ? 'filled' : ''}" data-value="${i}" ${interactive ? `onclick="ReviewSystem.setRating(${i})" onmouseover="ReviewSystem.previewRating(${i})" onmouseout="ReviewSystem.clearPreview()"` : ''}>★</span>`;
        }
        return html;
    },

    currentRating: 0,

    setRating(val) {
        this.currentRating = val;
        document.querySelectorAll('.star-input .star').forEach(s => {
            s.classList.toggle('filled', parseInt(s.dataset.value) <= val);
        });
        document.getElementById('ratingValue').textContent = val + '/5';
    },

    previewRating(val) {
        document.querySelectorAll('.star-input .star').forEach(s => {
            s.classList.toggle('filled', parseInt(s.dataset.value) <= val);
        });
    },

    clearPreview() {
        document.querySelectorAll('.star-input .star').forEach(s => {
            s.classList.toggle('filled', parseInt(s.dataset.value) <= this.currentRating);
        });
    },

    openReviewForm(universityId) {
        const form = document.getElementById('reviewForm');
        if (!form) return;
        form.style.display = 'block';
        form.dataset.universityId = universityId;
        this.currentRating = 0;
        const container = document.getElementById('starInput');
        if (container) {
            container.innerHTML = this.renderStars(0, true);
            container.innerHTML += '<span id="ratingValue" style="margin-left:8px; font-size:0.9rem; color: var(--text-muted);">0/5</span>';
        }
    },

    closeReviewForm() {
        const form = document.getElementById('reviewForm');
        if (form) form.style.display = 'none';
    },

    submitReview() {
        const form = document.getElementById('reviewForm');
        const universityId = form?.dataset.universityId;
        const name = document.getElementById('reviewerName')?.value || 'Ẩn danh';
        const comment = document.getElementById('reviewComment')?.value;
        const rating = this.currentRating;

        if (!rating || rating === 0) {
            alert('Vui lòng chọn số sao!');
            return;
        }
        if (!comment || comment.trim().length < 10) {
            alert('Vui lòng viết đánh giá (ít nhất 10 ký tự)!');
            return;
        }

        this.saveReview(universityId, { rating, name, comment });
        alert('✅ Cảm ơn bạn đã đánh giá!');
        this.closeReviewForm();
        // Refresh reviews display
        this.displayReviews(universityId);
    },

    displayReviews(universityId) {
        const container = document.getElementById('reviewsContainer');
        if (!container) return;

        const reviews = this.getReviews(universityId);
        const avgRating = this.getAverageRating(universityId);
        const count = this.getRatingCount(universityId);

        let html = `
            <div class="reviews-summary">
                <div class="reviews-average">
                    <span class="reviews-average-number">${avgRating}</span>
                    <div class="reviews-average-stars">${this.renderStars(Math.round(avgRating))}</div>
                    <span class="reviews-count">${count} đánh giá</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="ReviewSystem.openReviewForm('${universityId}')">
                    <i class="fas fa-star"></i> Viết đánh giá
                </button>
            </div>
        `;

        if (reviews.length > 0) {
            html += `<div class="reviews-list">`;
            reviews.sort((a, b) => parseInt(b.id) - parseInt(a.id)).forEach(r => {
                html += `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-avatar">${(r.name || 'A')[0].toUpperCase()}</div>
                            <div>
                                <div class="review-name">${r.name}</div>
                                <div class="review-stars">${this.renderStars(r.rating)}</div>
                            </div>
                            <span class="review-date">${r.date}</span>
                        </div>
                        <p class="review-comment">${r.comment}</p>
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html += `<p style="text-align:center; color: var(--text-muted); padding: 24px;">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>`;
        }

        container.innerHTML = html;
    }
};

// ===== FEATURE 4: WISHLIST & LỘ TRÌNH =====
const WishlistApp = {
    getWishlist() {
        return Storage.get('wishlist', []);
    },

    toggle(universityId) {
        let list = this.getWishlist();
        const idx = list.indexOf(universityId);
        if (idx >= 0) {
            list.splice(idx, 1);
        } else {
            list.push(universityId);
        }
        Storage.set('wishlist', list);
        this.updateUI(universityId);
        return list.includes(universityId);
    },

    isInList(universityId) {
        return this.getWishlist().includes(universityId);
    },

    updateUI(universityId) {
        const btns = document.querySelectorAll(`.wishlist-btn[data-id="${universityId}"]`);
        const isIn = this.isInList(universityId);
        btns.forEach(btn => {
            btn.classList.toggle('active', isIn);
            btn.innerHTML = isIn ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        });
    },

    getChecklist() {
        return Storage.get('checklist', {
            'Nghiên cứu trường': false,
            'Học tiếng Hàn/IELTS': false,
            'Chuẩn bị hồ sơ': false,
            'Dịch thuật công chứng': false,
            'Nộp đơn xin nhập học': false,
            'Nhận thư mời': false,
            'Chuẩn bị sổ tiết kiệm': false,
            'Xin visa': false,
            'Đặt vé máy bay': false,
            'Tìm nhà ở': false,
            'Mua bảo hiểm': false,
            'Chuẩn bị hành lý': false
        });
    },

    toggleChecklistItem(key) {
        const list = this.getChecklist();
        list[key] = !list[key];
        Storage.set('checklist', list);
        this.renderChecklist();
    },

    renderChecklist() {
        const el = document.getElementById('checklistContainer');
        if (!el) return;

        const list = this.getChecklist();
        const total = Object.keys(list).length;
        const done = Object.values(list).filter(v => v).length;
        const progress = total > 0 ? (done / total) * 100 : 0;

        let html = `
            <div class="checklist-header">
                <h4>📋 Lộ trình du học của bạn</h4>
                <span class="checklist-progress">${done}/${total} bước</span>
            </div>
            <div class="checklist-bar">
                <div class="checklist-bar-fill" style="width: ${progress}%"></div>
            </div>
            <div class="checklist-items">
        `;

        Object.entries(list).forEach(([key, val]) => {
            html += `
                <label class="checklist-item ${val ? 'done' : ''}">
                    <input type="checkbox" ${val ? 'checked' : ''} onchange="WishlistApp.toggleChecklistItem('${key.replace(/'/g, "\\'")}')">
                    <span>✅</span>
                    <span>${key}</span>
                </label>
            `;
        });

        html += '</div>';
        el.innerHTML = html;
    },

    renderWishlist() {
        const el = document.getElementById('wishlistContainer');
        if (!el) return;

        const ids = this.getWishlist();
        const items = ids.map(id => universities.find(u => u.id === id)).filter(Boolean);

        if (items.length === 0) {
            el.innerHTML = `
                <div style="text-align:center; padding: 40px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 12px;">💔</div>
                    <h4 style="margin-bottom: 8px;">Chưa có trường yêu thích</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Hãy khám phá và thả tim ❤️ các trường bạn quan tâm</p>
                    <a href="truong-hoc.html" class="btn btn-primary btn-sm" style="margin-top: 16px;">Khám phá trường</a>
                </div>
            `;
            return;
        }

        el.innerHTML = items.map(u => `
            <div class="wishlist-item" onclick="window.location.href='chi-tiet-truong.html?id=${u.id}'">
                <div class="wishlist-item-info">
                    <strong>${u.name}</strong>
                    <span>${u.region} · ${u.type}</span>
                </div>
                <button class="wishlist-btn active" data-id="${u.id}" onclick="event.stopPropagation(); WishlistApp.toggle('${u.id}')">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `).join('');
    }
};

// ===== FEATURE 5: CỘNG ĐỒNG HỎI & ĐÁP =====
const QAApp = {
    getQuestions() {
        return Storage.get('qa_questions', []);
    },

    saveQuestion(title, content, author = 'Ẩn danh') {
        const list = this.getQuestions();
        list.unshift({
            id: Date.now().toString(),
            title,
            content,
            author,
            date: new Date().toISOString().split('T')[0],
            answers: [],
            votes: 0
        });
        Storage.set('qa_questions', list);
        this.renderList();
    },

    addAnswer(questionId, content, author = 'Ẩn danh') {
        const list = this.getQuestions();
        const q = list.find(q => q.id === questionId);
        if (q) {
            q.answers.push({
                id: Date.now().toString(),
                content,
                author,
                date: new Date().toISOString().split('T')[0],
                votes: 0
            });
            Storage.set('qa_questions', list);
        }
    },

    vote(questionId, answerId = null, delta = 1) {
        const list = this.getQuestions();
        if (answerId) {
            const q = list.find(q => q.id === questionId);
            const a = q?.answers.find(a => a.id === answerId);
            if (a) a.votes += delta;
        } else {
            const q = list.find(q => q.id === questionId);
            if (q) q.votes += delta;
        }
        Storage.set('qa_questions', list);
        this.renderList();
    },

    renderList() {
        const el = document.getElementById('qaList');
        if (!el) return;

        const questions = this.getQuestions();

        if (questions.length === 0) {
            el.innerHTML = `
                <div style="text-align:center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 12px;">💬</div>
                    <h4 style="margin-bottom: 8px;">Chưa có câu hỏi nào</h4>
                    <p style="color: var(--text-muted);">Hãy đặt câu hỏi đầu tiên cho cộng đồng!</p>
                </div>
            `;
            return;
        }

        el.innerHTML = questions.map(q => `
            <div class="qa-item" onclick="QAApp.openDetail('${q.id}')">
                <div class="qa-votes">
                    <span class="qa-vote-count">${q.votes}</span>
                    <span>phiếu</span>
                </div>
                <div class="qa-main">
                    <h4>${q.title}</h4>
                    <p>${q.content.substring(0, 120)}${q.content.length > 120 ? '...' : ''}</p>
                    <div class="qa-meta">
                        <span>✍️ ${q.author}</span>
                        <span>📅 ${q.date}</span>
                        <span>💬 ${q.answers.length} trả lời</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    openDetail(questionId) {
        const el = document.getElementById('qaDetail');
        const list = document.getElementById('qaList');
        const form = document.getElementById('qaAskForm');

        if (!el) return;

        const question = this.getQuestions().find(q => q.id === questionId);
        if (!question) return;

        if (list) list.style.display = 'none';
        if (form) form.style.display = 'none';
        el.style.display = 'block';

        el.innerHTML = `
            <div style="margin-bottom: 16px;">
                <button class="btn btn-sm btn-secondary" onclick="QAApp.backToList()">← Quay lại</button>
            </div>
            <div class="qa-detail-header">
                <h3>${question.title}</h3>
                <p>${question.content}</p>
                <div class="qa-meta">
                    <span>✍️ ${question.author}</span>
                    <span>📅 ${question.date}</span>
                    <span>
                        <button class="btn btn-sm" style="background:none; border:none; cursor:pointer;" onclick="QAApp.vote('${question.id}', null, 1)">👍 ${question.votes}</button>
                    </span>
                </div>
            </div>
            <div class="qa-answers">
                <h4>${question.answers.length} câu trả lời</h4>
                ${question.answers.length === 0 ? '<p style="color: var(--text-muted);">Chưa có câu trả lời. Hãy là người đầu tiên trả lời!</p>' :
                question.answers.map(a => `
                    <div class="qa-answer-item">
                        <div class="qa-answer-content">
                            <p>${a.content}</p>
                            <div class="qa-meta">
                                <span>✍️ ${a.author}</span>
                                <span>📅 ${a.date}</span>
                                <button class="btn btn-sm" style="background:none; border:none; cursor:pointer;" onclick="QAApp.vote('${question.id}', '${a.id}', 1)">👍 ${a.votes}</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 24px;">
                <h4>Viết câu trả lời</h4>
                <textarea id="qaAnswerContent" placeholder="Chia sẻ kiến thức của bạn..." style="width:100%; min-height:100px; padding:12px; border: 2px solid var(--border); border-radius: var(--radius-md); font-family:inherit; margin:8px 0;"></textarea>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="qaAnswerName" placeholder="Tên của bạn (để trống nếu ẩn danh)" style="flex:1; padding:10px 14px; border: 2px solid var(--border); border-radius: var(--radius-md); font-family:inherit;">
                    <button class="btn btn-primary btn-sm" onclick="QAApp.submitAnswer('${question.id}')">Gửi trả lời</button>
                </div>
            </div>
        `;
    },

    submitAnswer(questionId) {
        const content = document.getElementById('qaAnswerContent')?.value;
        const name = document.getElementById('qaAnswerName')?.value || 'Ẩn danh';

        if (!content || content.trim().length < 5) {
            alert('Vui lòng viết câu trả lời (ít nhất 5 ký tự)!');
            return;
        }

        this.addAnswer(questionId, content, name);
        alert('✅ Câu trả lời đã được gửi!');
        this.openDetail(questionId); // Refresh
    },

    submitQuestion() {
        const title = document.getElementById('qaQuestionTitle')?.value;
        const content = document.getElementById('qaQuestionContent')?.value;
        const name = document.getElementById('qaQuestionName')?.value || 'Ẩn danh';

        if (!title || title.trim().length < 10) {
            alert('Vui lòng nhập tiêu đề (ít nhất 10 ký tự)!');
            return;
        }
        if (!content || content.trim().length < 10) {
            alert('Vui lòng nhập nội dung câu hỏi!');
            return;
        }

        this.saveQuestion(title, content, name);
        alert('✅ Câu hỏi đã được đăng!');
        document.getElementById('qaQuestionTitle').value = '';
        document.getElementById('qaQuestionContent').value = '';
        document.getElementById('qaQuestionName').value = '';
    },

    backToList() {
        const el = document.getElementById('qaDetail');
        const list = document.getElementById('qaList');
        const form = document.getElementById('qaAskForm');
        if (el) el.style.display = 'none';
        if (list) list.style.display = 'block';
        if (form) form.style.display = 'block';
        this.renderList();
    },

    renderStats() {
        const el = document.getElementById('qaStats');
        if (!el) return;
        const questions = this.getQuestions();
        const totalAnswers = questions.reduce((sum, q) => sum + q.answers.length, 0);
        el.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                    <span style="color:var(--text-muted);">Tổng câu hỏi</span>
                    <strong>${questions.length}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                    <span style="color:var(--text-muted);">Tổng câu trả lời</span>
                    <strong>${totalAnswers}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                    <span style="color:var(--text-muted);">Tỉ lệ trả lời</span>
                    <strong>${questions.length > 0 ? (totalAnswers / questions.length).toFixed(1) : 0}/câu</strong>
                </div>
            </div>
        `;
    },

    init() {
        const listEl = document.getElementById('qaList');
        const detailEl = document.getElementById('qaDetail');
        if (listEl) {
            this.renderList();
            this.renderStats();
        }
        if (detailEl) detailEl.style.display = 'none';
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Quiz
    QuizApp.init();

    // Blog
    BlogApp.init();

    // Q&A
    QAApp.init();

    // Wishlist - add buttons to existing cards
    document.querySelectorAll('.university-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Already handled by onclick attribute
        });
    });

    // Initialize checklist if on profile page
    const checklistEl = document.getElementById('checklistContainer');
    if (checklistEl) WishlistApp.renderChecklist();

    const wishlistEl = document.getElementById('wishlistContainer');
    if (wishlistEl) WishlistApp.renderWishlist();
});
