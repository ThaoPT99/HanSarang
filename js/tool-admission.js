/* ===========================================
   THÔNG TIN TRƯỜNG HÀN - Admission Tool
   Máy tính cơ hội du học Hàn Quốc
   =========================================== */

const AdmissionTool = {
    // Parse TOPIK requirement string -> numeric level
    parseTopik(reqStr) {
        if (!reqStr) return 0;
        const m = reqStr.match(/TOPIK\s*(\d+)/);
        return m ? parseInt(m[1]) : 0;
    },

    // Parse IELTS requirement string -> numeric score
    parseIelts(reqStr) {
        if (!reqStr) return 0;
        const m = reqStr.match(/IELTS\s*([\d.]+)/);
        return m ? parseFloat(m[1]) : 0;
    },

    // Parse TOEFL requirement -> convert to IELTS equivalent
    parseToefl(reqStr) {
        if (!reqStr) return 0;
        const m = reqStr.match(/TOEFL\s*(\d+)/);
        if (!m) return 0;
        const t = parseInt(m[1]);
        if (t >= 90) return 6.5;
        if (t >= 80) return 6.0;
        if (t >= 70) return 5.5;
        return 5.0;
    },

    // Get max IELTS requirement from string
    getMaxIelts(reqStr) {
        const ielts = this.parseIelts(reqStr);
        const toefl = this.parseToefl(reqStr);
        return Math.max(ielts, toefl);
    },

    // Parse GPA from Vietnamese 10-scale
    gpaToScore(gpa) {
        if (gpa >= 9.0) return { score: 25, label: 'Xuất sắc', grade: 'A' };
        if (gpa >= 8.0) return { score: 20, label: 'Giỏi', grade: 'B+' };
        if (gpa >= 7.0) return { score: 15, label: 'Khá', grade: 'B' };
        if (gpa >= 6.0) return { score: 10, label: 'Trung bình khá', grade: 'C+' };
        if (gpa >= 5.0) return { score: 5, label: 'Trung bình', grade: 'C' };
        return { score: 0, label: 'Yếu', grade: 'D' };
    },

    // Parse tuition range string -> numeric avg
    parseTuition(tuitionStr) {
        if (tuitionRanges && tuitionRanges[tuitionStr]) {
            const r = tuitionRanges[tuitionStr];
            return (r.min + r.max) / 2;
        }
        // Fallback: try to extract numbers
        const nums = tuitionStr.match(/[\d,]+/g);
        if (!nums) return 5000;
        const vals = nums.map(n => parseFloat(n.replace(/,/g, '')));
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    },

    // Main matching function
    calculateMatches(input) {
        const results = [];
        const gpaInfo = this.gpaToScore(input.gpa);

        for (const u of universities) {
            let totalScore = 0;
            let maxScore = 100;
            const details = [];

            // 1. GPA match (25 points max)
            let gpaScore = 0;
            if (u.tier === 'SKY' || u.tier === 'Đặc biệt') {
                gpaScore = input.gpa >= 8.0 ? 25 : input.gpa >= 7.0 ? 18 : input.gpa >= 6.0 ? 10 : 5;
            } else if (u.tier === 'Top 10') {
                gpaScore = input.gpa >= 7.5 ? 25 : input.gpa >= 6.5 ? 18 : input.gpa >= 5.5 ? 10 : 5;
            } else if (u.tier === 'Top 20') {
                gpaScore = input.gpa >= 7.0 ? 25 : input.gpa >= 6.0 ? 18 : input.gpa >= 5.0 ? 12 : 5;
            } else {
                gpaScore = input.gpa >= 6.5 ? 25 : input.gpa >= 5.5 ? 20 : input.gpa >= 5.0 ? 15 : 8;
            }
            totalScore += gpaScore;
            details.push({ name: 'GPA', score: gpaScore, max: 25, detail: `${input.gpa}/10 - ${gpaInfo.label}` });

            // 2. TOPIK match (25 points max)
            const reqTopik = this.parseTopik(u.topikRequired);
            let topikScore = 0;
            if (input.topik === 0 && reqTopik > 0) {
                topikScore = 2; // No TOPIK yet but some schools accept
                details.push({ name: 'TOPIK', score: topikScore, max: 25, detail: 'Chưa có TOPIK - có thể học tiếng trước' });
            } else if (input.topik >= reqTopik) {
                topikScore = Math.min(25, 15 + (input.topik - reqTopik) * 5);
                details.push({ name: 'TOPIK', score: topikScore, max: 25, detail: `TOPIK ${input.topik} (yêu cầu: ${reqTopik})` });
            } else {
                topikScore = Math.max(2, 10 - (reqTopik - input.topik) * 5);
                details.push({ name: 'TOPIK', score: topikScore, max: 25, detail: `TOPIK ${input.topik} (yêu cầu: ${reqTopik}) - thiếu ${reqTopik - input.topik} cấp` });
            }
            totalScore += topikScore;

            // 3. English match (20 points max)
            const reqIelts = this.getMaxIelts(u.englishRequired);
            let engScore = 0;
            if (input.ielts > 0) {
                if (input.ielts >= reqIelts) {
                    engScore = Math.min(20, 12 + (input.ielts - reqIelts) * 5);
                } else {
                    engScore = Math.max(2, 8 - (reqIelts - input.ielts) * 5);
                }
                details.push({ name: 'IELTS', score: engScore, max: 20, detail: `IELTS ${input.ielts} (yêu cầu: ${reqIelts > 0 ? reqIelts : 'không yêu cầu'})` });
            } else if (u.language && u.language.includes('Tiếng Hàn') && !u.language.includes('Tiếng Anh')) {
                engScore = 15; // Not required, chương trình tiếng Hàn
                details.push({ name: 'IELTS', score: engScore, max: 20, detail: 'Không yêu cầu tiếng Anh (chương trình tiếng Hàn)' });
            } else {
                engScore = 5;
                details.push({ name: 'IELTS', score: engScore, max: 20, detail: 'Chưa có IELTS - nên bổ sung' });
            }
            totalScore += engScore;

            // 4. Budget match (20 points max)
            const avgTuition = this.parseTuition(u.tuition);
            const livingCost = u.region === 'Seoul' ? 8000 : u.region === 'Busan' || u.region === 'Incheon' ? 6000 : 5000;
            const totalCost = avgTuition + livingCost;
            let budgetScore = 0;
            if (input.budget >= totalCost * 1.2) {
                budgetScore = 20;
            } else if (input.budget >= totalCost) {
                budgetScore = 15;
            } else if (input.budget >= totalCost * 0.7) {
                budgetScore = 8;
            } else {
                budgetScore = 3;
            }
            totalScore += budgetScore;
            details.push({ name: 'Tài chính', score: budgetScore, max: 20, detail: `Học phí ~${avgTuition.toFixed(0)} USD + sinh hoạt ~${livingCost} USD/năm (tổng ~${totalCost.toFixed(0)} USD/năm)` });

            // 5. Region preference (10 points max)
            let regionScore = 5; // neutral
            if (input.region && input.region !== 'all') {
                if (u.region === input.region) {
                    regionScore = 10;
                    details.push({ name: 'Khu vực', score: 10, max: 10, detail: `${u.region} - đúng khu vực bạn chọn` });
                } else {
                    regionScore = 3;
                    details.push({ name: 'Khu vực', score: 3, max: 10, detail: `${u.region} - khác khu vực bạn chọn` });
                }
            } else {
                details.push({ name: 'Khu vực', score: 5, max: 10, detail: 'Không yêu cầu khu vực cụ thể' });
            }
            totalScore += regionScore;

            // Normalize and calculate percentage
            const pct = Math.round((totalScore / maxScore) * 100);

            let level, color;
            if (pct >= 75) { level = 'Rất phù hợp'; color = '#2ecc71'; }
            else if (pct >= 55) { level = 'Khả thi'; color = '#f39c12'; }
            else if (pct >= 35) { level = 'Cần cố gắng'; color = '#e67e22'; }
            else { level = 'Khó'; color = '#e74c3c'; }

            // Check degree compatibility
            const degreeMatch = input.degree === 'all' || u.programs.some(p => {
                const degMap = { 'bachelor': 'Cử nhân', 'master': 'Thạc sĩ', 'doctor': 'Tiến sĩ', 'language': 'Khóa học tiếng Hàn' };
                return p.includes(degMap[input.degree] || input.degree);
            }) || (input.degree === 'language' && u.type === 'Trung tâm Ngôn ngữ');

            results.push({
                university: u,
                score: pct,
                level,
                color,
                details,
                totalCost: Math.round(totalCost),
                degreeMatch,
                tuition: avgTuition,
                livingCost
            });
        }

        // Sort by score descending, filter out degree mismatches
        const filtered = results.filter(r => r.degreeMatch);
        filtered.sort((a, b) => b.score - a.score);
        return {
            matches: filtered,
            topMatch: filtered[0] || null,
            totalChecked: results.length,
            matchedCount: filtered.length
        };
    },

    render() {
        const container = document.getElementById('toolContainer');
        if (!container) return;

        container.innerHTML = this.getFormHTML();
        // Set default program to bachelor
        // Get query params
        const params = new URLSearchParams(window.location.search);
        if (params.get('gpa')) {
            document.getElementById('inputGpa').value = params.get('gpa');
            document.getElementById('inputTopik').value = params.get('topik') || '0';
            document.getElementById('inputIelts').value = params.get('ielts') || '0';
            document.getElementById('inputBudget').value = params.get('budget') || '10000';
            if (params.get('region')) document.getElementById('inputRegion').value = params.get('region');
            if (params.get('degree')) document.getElementById('inputDegree').value = params.get('degree');
            this.runCalculation();
        }
    },

    // Generate shareable URL
    getShareUrl(input) {
        const base = window.location.origin + window.location.pathname;
        return `${base}?gpa=${input.gpa}&topik=${input.topik}&ielts=${input.ielts}&budget=${input.budget}&region=${input.region}&degree=${input.degree}`;
    },

    getFormHTML() {
        return `
            <div style="max-width:900px; margin:0 auto;">
                <div class="tool-card" style="background:var(--bg-primary); border-radius:var(--radius-xl); padding:32px; box-shadow:var(--shadow-lg); border:1px solid var(--border-light);">
                    <div style="text-align:center; margin-bottom:28px;">
                        <div style="font-size:3rem; margin-bottom:8px;">🎯</div>
                        <h2 style="margin-bottom:6px;">Bạn có cơ hội vào trường nào?</h2>
                        <p style="color:var(--text-muted); font-size:0.9rem;">Nhập thông tin của bạn, chúng tôi sẽ gợi ý trường phù hợp nhất!</p>
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
                        <div class="form-group">
                            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:6px; color:var(--text-secondary);">📊 GPA (hệ 10)</label>
                            <input type="number" id="inputGpa" min="0" max="10" step="0.1" value="7.0" placeholder="VD: 7.5"
                                style="width:100%; padding:12px 14px; border:2px solid var(--border); border-radius:var(--radius-md); font-size:0.95rem; font-family:inherit; transition:var(--transition); background:var(--bg-primary);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:6px; color:var(--text-secondary);">🇰🇷 TOPIK</label>
                            <select id="inputTopik"
                                style="width:100%; padding:12px 14px; border:2px solid var(--border); border-radius:var(--radius-md); font-size:0.95rem; font-family:inherit; transition:var(--transition); background:var(--bg-primary);">
                                <option value="0">Chưa có</option>
                                <option value="1">TOPIK 1</option>
                                <option value="2">TOPIK 2</option>
                                <option value="3" selected>TOPIK 3</option>
                                <option value="4">TOPIK 4</option>
                                <option value="5">TOPIK 5</option>
                                <option value="6">TOPIK 6</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:6px; color:var(--text-secondary);">📖 IELTS</label>
                            <input type="number" id="inputIelts" min="0" max="9" step="0.5" value="0" placeholder="VD: 6.0"
                                style="width:100%; padding:12px 14px; border:2px solid var(--border); border-radius:var(--radius-md); font-size:0.95rem; font-family:inherit; transition:var(--transition); background:var(--bg-primary);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:6px; color:var(--text-secondary);">💰 Ngân sách (USD/năm)</label>
                            <input type="number" id="inputBudget" min="3000" max="50000" step="1000" value="15000"
                                style="width:100%; padding:12px 14px; border:2px solid var(--border); border-radius:var(--radius-md); font-size:0.95rem; font-family:inherit; transition:var(--transition); background:var(--bg-primary);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:6px; color:var(--text-secondary);">📍 Khu vực</label>
                            <select id="inputRegion"
                                style="width:100%; padding:12px 14px; border:2px solid var(--border); border-radius:var(--radius-md); font-size:0.95rem; font-family:inherit; transition:var(--transition); background:var(--bg-primary);">
                                <option value="all">Không yêu cầu</option>
                                <option value="Seoul">Seoul</option>
                                <option value="Busan">Busan</option>
                                <option value="Daegu">Daegu</option>
                                <option value="Daejeon">Daejeon</option>
                                <option value="Gwangju">Gwangju</option>
                                <option value="Incheon">Incheon</option>
                                <option value="Gyeonggi">Gyeonggi</option>
                                <option value="Gangwon">Gangwon</option>
                                <option value="Jeju">Jeju</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:6px; color:var(--text-secondary);">🎓 Bậc học</label>
                            <select id="inputDegree"
                                style="width:100%; padding:12px 14px; border:2px solid var(--border); border-radius:var(--radius-md); font-size:0.95rem; font-family:inherit; transition:var(--transition); background:var(--bg-primary);">
                                <option value="all">Tất cả</option>
                                <option value="bachelor" selected>Cử nhân (Đại học)</option>
                                <option value="master">Thạc sĩ</option>
                                <option value="doctor">Tiến sĩ</option>
                                <option value="language">Tiếng Hàn (D-4)</option>
                            </select>
                        </div>
                    </div>

                    <button onclick="AdmissionTool.runCalculation()" id="calcBtn"
                        style="width:100%; padding:14px; background:var(--primary); color:white; border:none; border-radius:var(--radius-md); font-size:1rem; font-weight:700; cursor:pointer; transition:var(--transition);">
                        🔍 Tính cơ hội trúng tuyển
                    </button>

                    <div id="toolSpinner" style="display:none; text-align:center; padding:40px;">
                        <div style="font-size:2rem; animation:spin 1s linear infinite;">⏳</div>
                        <p style="color:var(--text-muted); margin-top:12px;">Đang phân tích dữ liệu...</p>
                    </div>
                </div>

                <div id="toolResults"></div>
            </div>
        `;
    },

    runCalculation() {
        const gpa = Math.min(10, Math.max(0, parseFloat(document.getElementById('inputGpa').value) || 0));
        const topik = Math.min(6, Math.max(0, parseInt(document.getElementById('inputTopik').value) || 0));
        const ielts = Math.min(9, Math.max(0, parseFloat(document.getElementById('inputIelts').value) || 0));
        const budget = Math.max(3000, parseInt(document.getElementById('inputBudget').value) || 10000);
        const region = document.getElementById('inputRegion').value;
        const degree = document.getElementById('inputDegree').value;

        // Update fields with clamped values
        document.getElementById('inputGpa').value = gpa;
        document.getElementById('inputIelts').value = ielts;
        document.getElementById('inputBudget').value = budget;

        // Show spinner
        document.getElementById('toolSpinner').style.display = 'block';
        document.getElementById('toolResults').innerHTML = '';

        // Smooth scroll and slight delay for UX
        setTimeout(() => {
            document.getElementById('toolSpinner').style.display = 'none';

            const input = { gpa, topik, ielts, budget, region, degree };
            const result = this.calculateMatches(input);
            this.renderResults(result, input);

            // Scroll to results
            document.getElementById('toolResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    },

    renderResults(result, input) {
        const container = document.getElementById('toolResults');
        const top = result.topMatch;

        let html = `
            <!-- Summary -->
            <div style="background:var(--bg-primary); border-radius:var(--radius-xl); padding:28px; box-shadow:var(--shadow-md); margin-top:24px; border:1px solid var(--border-light);">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
                    <div>
                        <h2 style="font-size:1.3rem;">📊 Kết quả phân tích</h2>
                        <p style="color:var(--text-muted); font-size:0.85rem;">Kiểm tra ${result.totalChecked} trường - tìm thấy ${result.matchedCount} trường phù hợp với bậc học của bạn</p>
                    </div>
                    <button onclick="AdmissionTool.copyShareUrl()" style="padding:8px 16px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer; font-size:0.85rem;">
                        🔗 Sao chép link kết quả
                    </button>
                </div>

                ${top ? `
                <div style="background:linear-gradient(135deg, ${top.color}11, ${top.color}05); border:2px solid ${top.color}33; border-radius:var(--radius-lg); padding:20px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                        <div style="width:64px; height:64px; border-radius:50%; background:${top.color}; display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:white; font-weight:800;">${top.score}%</div>
                        <div style="flex:1;">
                            <div style="font-size:0.78rem; color:${top.color}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">🎯 GỢI Ý TỐT NHẤT</div>
                            <h3 style="font-size:1.15rem; margin:4px 0;">${top.university.name}</h3>
                            <p style="color:var(--text-muted); font-size:0.85rem;">${top.university.region} · ${top.university.type} · Học phí ~${top.tuition.toFixed(0)} USD/năm</p>
                        </div>
                        <a href="chi-tiet-truong.html?id=${top.university.id}" target="_blank" style="padding:8px 20px; background:${top.color}; color:white; border-radius:var(--radius-md); font-weight:600; font-size:0.85rem; text-decoration:none;">Xem chi tiết →</a>
                    </div>
                </div>
                ` : ''}

                <!-- User profile summary -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-bottom:24px;">
                    <div style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-md); text-align:center;">
                        <div style="font-size:1.2rem; font-weight:700;">${input.gpa}</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">GPA /10</div>
                    </div>
                    <div style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-md); text-align:center;">
                        <div style="font-size:1.2rem; font-weight:700;">${input.topik > 0 ? 'TOPIK ' + input.topik : 'Chưa có'}</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">TOPIK</div>
                    </div>
                    <div style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-md); text-align:center;">
                        <div style="font-size:1.2rem; font-weight:700;">${input.ielts > 0 ? 'IELTS ' + input.ielts : 'Chưa có'}</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">IELTS</div>
                    </div>
                    <div style="background:var(--bg-secondary); padding:12px 16px; border-radius:var(--radius-md); text-align:center;">
                        <div style="font-size:1.2rem; font-weight:700;">${(input.budget / 1000).toFixed(0)}K USD</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">Ngân sách/năm</div>
                    </div>
                </div>
            </div>

            <!-- Results list -->
            <div style="margin-top:20px;">
                <h3 style="margin-bottom:16px;">📋 Danh sách trường theo mức độ phù hợp</h3>
                ${result.matches.length === 0 ? '<p style="color:var(--text-muted);">Không tìm thấy trường phù hợp. Hãy thử thay đổi thông tin hoặc chọn bậc học khác.</p>' : ''}
        `;

        // Results by level
        const groups = { 'Rất phù hợp': [], 'Khả thi': [], 'Cần cố gắng': [], 'Khó': [] };
        for (const m of result.matches) {
            if (groups[m.level]) groups[m.level].push(m);
        }

        const levelColors = {
            'Rất phù hợp': { bg: '#2ecc71', label: '🟢 Rất phù hợp - Nộp đơn ngay!' },
            'Khả thi': { bg: '#f39c12', label: '🟡 Khả thi - Cần chuẩn bị thêm' },
            'Cần cố gắng': { bg: '#e67e22', label: '🟠 Cần cố gắng - Cải thiện hồ sơ' },
            'Khó': { bg: '#e74c3c', label: '🔴 Khó - Yêu cầu cao' }
        };

        for (const [level, items] of Object.entries(groups)) {
            if (items.length === 0) continue;
            const lc = levelColors[level];
            html += `
                <div style="margin-bottom:16px;">
                    <h4 style="color:${lc.bg}; margin-bottom:10px; font-size:0.9rem;">${lc.label} (${items.length})</h4>
                    ${items.map(m => this.renderResultCard(m)).join('')}
                </div>
            `;
        }

        html += `</div>`;

        container.innerHTML = html;
    },

    renderResultCard(match) {
        const u = match.university;
        // Top 3 detail items
        const topDetails = match.details.slice(0, 4);

        return `
            <div class="result-card" style="background:var(--bg-primary); border-radius:var(--radius-lg); padding:20px; margin-bottom:10px; border:1px solid var(--border-light); border-left:4px solid ${match.color}; box-shadow:var(--shadow-sm); transition:var(--transition); cursor:pointer;" 
                 onclick="window.open('chi-tiet-truong.html?id=${u.id}', '_blank')">
                <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                    <div style="width:56px; height:56px; border-radius:50%; background:${match.color}22; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <span style="font-size:1.3rem; font-weight:800; color:${match.color};">${match.score}%</span>
                    </div>
                    <div style="flex:1; min-width:200px;">
                        <h4 style="font-size:0.95rem; margin-bottom:2px;">${u.name}</h4>
                        <p style="font-size:0.78rem; color:var(--text-muted);">
                            ${u.region} · ${u.type} · ${u.tier}
                            ${match.totalCost ? `· ~${match.totalCost} USD/năm` : ''}
                        </p>
                    </div>
                    <div style="font-size:0.75rem; color:${match.color}; font-weight:600; padding:4px 12px; background:${match.color}11; border-radius:var(--radius-full); white-space:nowrap;">
                        ${match.level}
                    </div>
                </div>
                <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; padding-top:10px; border-top:1px solid var(--border-light);">
                    ${topDetails.map(d => `
                        <div style="font-size:0.75rem; color:var(--text-muted); flex:1; min-width:120px;">
                            <span style="font-weight:600; color:var(--text-secondary);">${d.name}:</span> ${d.detail}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    copyShareUrl() {
        const gpa = document.getElementById('inputGpa').value;
        const topik = document.getElementById('inputTopik').value;
        const ielts = document.getElementById('inputIelts').value;
        const budget = document.getElementById('inputBudget').value;
        const region = document.getElementById('inputRegion').value;
        const degree = document.getElementById('inputDegree').value;
        const url = this.getShareUrl({ gpa, topik, ielts, budget, region, degree });
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ Đã sao chép link kết quả! Bạn có thể gửi cho bạn bè để so sánh.');
        }).catch(() => {
            prompt('📋 Sao chép link này:', url);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => AdmissionTool.render());
