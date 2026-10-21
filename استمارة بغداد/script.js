/**
 * ==========================================================================
 * بغداد دلفري | Baghdad Delivery - ملف التحكم البرمجي الكامل (script.js)
 * ==========================================================================
 */

// ==========================================================================
// [رقم واتساب الشركة الرسمي]:
// يجب أن يبدأ بـ 964 متبوعاً بالرقم بدون الصفر الأول ودون (+)
// ==========================================================================
let COMPANY_WHATSAPP_NUMBER = "9647714189224";

// حالة التطبيق
let selectedVehicle = 'motorcycle';
let currentStage = 1;

// ==========================================================================
// نقطة البداية
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initVehicleScreenSelection();
  initFormStageNavigation();
  initDistrictOtherToggle();
  initFormSubmission();
  initModalActions();
});

// ==========================================================================
// 1. شاشة اختيار المركبة
// ==========================================================================
function initVehicleScreenSelection() {
  const choiceCards = document.querySelectorAll('.vehicle-choice-card');
  const vehicleScreen = document.getElementById('vehicleSelectScreen');
  const formContainer = document.getElementById('formContainer');
  const changeVehicleBtn = document.getElementById('changeVehicleBtn');
  const logoHeaderBtn = document.getElementById('logoHeaderBtn');

  choiceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-vehicle');
      openFormForVehicle(type);
    });
  });

  if (changeVehicleBtn) {
    changeVehicleBtn.addEventListener('click', showVehicleSelectionScreen);
  }

  if (logoHeaderBtn) {
    logoHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showVehicleSelectionScreen();
    });
  }

  function openFormForVehicle(vehicleType) {
    selectedVehicle = vehicleType === 'car' ? 'car' : 'motorcycle';
    applyVehicleSpecificQuestions(selectedVehicle);

    if (vehicleScreen) {
      vehicleScreen.classList.remove('vehicle-screen-active');
      vehicleScreen.classList.add('vehicle-screen-hidden');
    }
    if (formContainer) {
      formContainer.classList.remove('form-container-hidden');
      formContainer.classList.add('form-container-active');
    }

    goToStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showVehicleSelectionScreen() {
    if (formContainer) {
      formContainer.classList.remove('form-container-active');
      formContainer.classList.add('form-container-hidden');
    }
    if (vehicleScreen) {
      vehicleScreen.classList.remove('vehicle-screen-hidden');
      vehicleScreen.classList.add('vehicle-screen-active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==========================================================================
// 2. تبديل أسئلة المركبة
// ==========================================================================
function applyVehicleSpecificQuestions(type) {
  const nameEl = document.getElementById('selectedVehicleName');
  const emojiEl = document.getElementById('selectedVehicleEmoji');
  const motoSection = document.getElementById('motorcycleQuestionsSection');
  const carSection = document.getElementById('carQuestionsSection');
  const stage3Tab = document.getElementById('stage3TabTitle');

  if (type === 'car') {
    if (nameEl) nameEl.textContent = 'كابتن سيارة خاصة';
    if (emojiEl) emojiEl.textContent = '🚗';
    if (stage3Tab) stage3Tab.textContent = 'معلومات السيارة';

    if (motoSection) motoSection.style.display = 'none';
    if (carSection) carSection.style.display = 'block';
  } else {
    if (nameEl) nameEl.textContent = 'كابتن دراجة نارية (ماطور)';
    if (emojiEl) emojiEl.textContent = '🏍️';
    if (stage3Tab) stage3Tab.textContent = 'معلومات الدراجة';

    if (carSection) carSection.style.display = 'none';
    if (motoSection) motoSection.style.display = 'block';
  }
}

// ==========================================================================
// 3. التنقل بين المراحل + التحقق
// ==========================================================================
function initFormStageNavigation() {
  const nextBtn = document.getElementById('nextStageBtn');
  const prevBtn = document.getElementById('prevStageBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStage(currentStage)) {
        goToStage(currentStage + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStage(currentStage - 1);
    });
  }

  const indicators = document.querySelectorAll('.step-indicator-btn');
  indicators.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-stage'), 10);
      if (target < currentStage || validateStage(currentStage)) {
        goToStage(target);
      }
    });
  });
}

function goToStage(stageNum) {
  if (stageNum < 1 || stageNum > 4) return;
  currentStage = stageNum;

  document.querySelectorAll('.form-stage').forEach((stage) => {
    stage.classList.remove('active');
  });
  const currentStageEl = document.getElementById(`stage${stageNum}`);
  if (currentStageEl) currentStageEl.classList.add('active');

  document.querySelectorAll('.step-indicator-btn').forEach((btn) => {
    const s = parseInt(btn.getAttribute('data-stage'), 10);
    btn.classList.remove('active', 'completed');
    if (s === currentStage) btn.classList.add('active');
    else if (s < currentStage) btn.classList.add('completed');
  });

  const prevBtn = document.getElementById('prevStageBtn');
  const nextBtn = document.getElementById('nextStageBtn');
  const submitBtn = document.getElementById('submitWhatsAppBtn');

  if (prevBtn) prevBtn.style.display = currentStage > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentStage < 4 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = currentStage === 4 ? 'inline-flex' : 'none';

  const formCard = document.querySelector('.form-card');
  if (formCard) {
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================================================
// 4. التحكم بإظهار حقل "منطقة أخرى"
// ==========================================================================
function initDistrictOtherToggle() {
  const districtSelect = document.getElementById('district');
  const otherBlock = document.getElementById('otherDistrictBlock');
  const otherInput = document.getElementById('otherDistrictInput');

  if (districtSelect && otherBlock) {
    districtSelect.addEventListener('change', () => {
      if (districtSelect.value === 'منطقة أخرى في بغداد') {
        otherBlock.style.display = 'flex';
        otherBlock.classList.remove('has-error');
        if (otherInput) otherInput.value = '';
      } else {
        otherBlock.style.display = 'none';
        otherBlock.classList.remove('has-error');
      }
    });
  }
}

// ==========================================================================
// 5. التحقق من صحة المراحل (جميع الحقول إلزامية)
// ==========================================================================
function validateStage(stageNum) {
  let isStageValid = true;
  const iraqiPhoneRegex = /^(07[3-9]\d{8}|7[3-9]\d{8}|9647[3-9]\d{8})$/;

  // المرحلة 1: شروط التسجيل
  if (stageNum === 1) {
    const cond1 = document.getElementById('condVehicleRegistered').checked;
    const cond2 = document.getElementById('condDrivingLicense').checked;
    const cond3 = document.getElementById('condCriminalRecord').checked;
    const cond4 = document.getElementById('condAge18').checked;
    const errorHint = document.getElementById('conditionsErrorHint');

    if (!cond1 || !cond2 || !cond3 || !cond4) {
      if (errorHint) errorHint.style.display = 'block';
      isStageValid = false;
    } else {
      if (errorHint) errorHint.style.display = 'none';
    }
  }

  // المرحلة 2: المعلومات الشخصية
  if (stageNum === 2) {
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phoneNumber');
    const altPhone = document.getElementById('alternatePhone');
    const age = document.getElementById('birthDateOrAge');
    const district = document.getElementById('district');
    const landmark = document.getElementById('landmark');

    if (!fullName.value.trim() || fullName.value.trim().split(' ').length < 3) {
      setFieldError(fullName, 'يرجى كتابة الاسم الثلاثي');
      isStageValid = false;
    } else clearFieldError(fullName);

    const cleanPhone = phone.value.replace(/\D/g, '');
    if (!phone.value.trim() || !iraqiPhoneRegex.test(cleanPhone)) {
      setFieldError(phone, 'يرجى إدخال رقم هاتف عراقي صحيح');
      isStageValid = false;
    } else clearFieldError(phone);

    const cleanAltPhone = altPhone.value.replace(/\D/g, '');
    if (!altPhone.value.trim() || !iraqiPhoneRegex.test(cleanAltPhone)) {
      setFieldError(altPhone, 'يرجى إدخال رقم هاتف بديل صحيح');
      isStageValid = false;
    } else clearFieldError(altPhone);

    if (!age.value.trim()) {
      setFieldError(age, 'يرجى إدخال العمر أو سنة التولد');
      isStageValid = false;
    } else clearFieldError(age);

    if (!district.value) {
      setFieldError(district, 'يرجى اختيار منطقة السكن');
      isStageValid = false;
    } else if (district.value === 'منطقة أخرى في بغداد') {
      const otherDistrictInput = document.getElementById('otherDistrictInput');
      if (!otherDistrictInput.value.trim()) {
        setFieldError(otherDistrictInput, 'يرجى كتابة اسم المنطقة');
        isStageValid = false;
      } else {
        clearFieldError(otherDistrictInput);
        clearFieldError(district);
      }
    } else {
      clearFieldError(district);
    }

    if (!landmark.value.trim()) {
      setFieldError(landmark, 'يرجى تحديد أقرب نقطة دالة');
      isStageValid = false;
    } else clearFieldError(landmark);
  }

  // المرحلة 3: معلومات المركبة
  if (stageNum === 3) {
    if (selectedVehicle === 'motorcycle') {
      const motoMakeModel = document.getElementById('motoMakeModel');
      const motoPlate = document.getElementById('motoPlate');
      const motoYear = document.getElementById('motoYear');
      const motoColor = document.getElementById('motoColor');
      const motoAnnual = document.getElementById('motoAnnualValid');
      const motoLicense = document.getElementById('motoLicenseValid');
      const motoCriminal = document.getElementById('motoCriminalRecord');

      if (!motoMakeModel.value.trim()) { setFieldError(motoMakeModel, 'يرجى كتابة النوع/الموديل'); isStageValid = false; } else clearFieldError(motoMakeModel);
      if (!motoPlate.value.trim()) { setFieldError(motoPlate, 'يرجى كتابة رقم اللوحة'); isStageValid = false; } else clearFieldError(motoPlate);
      if (!motoYear.value.trim()) { setFieldError(motoYear, 'يرجى كتابة سنة الصنع'); isStageValid = false; } else clearFieldError(motoYear);
      if (!motoColor.value.trim()) { setFieldError(motoColor, 'يرجى كتابة اللون'); isStageValid = false; } else clearFieldError(motoColor);
      
      if (!motoAnnual.value) { setFieldError(motoAnnual, 'يرجى الاختيار'); isStageValid = false; } else clearFieldError(motoAnnual);
      if (!motoLicense.value) { setFieldError(motoLicense, 'يرجى الاختيار'); isStageValid = false; } else clearFieldError(motoLicense);
      if (!motoCriminal.value) { setFieldError(motoCriminal, 'يرجى الاختيار'); isStageValid = false; } else clearFieldError(motoCriminal);

    } else if (selectedVehicle === 'car') {
      const carMakeModel = document.getElementById('carMakeModel');
      const carPlate = document.getElementById('carPlate');
      const carYear = document.getElementById('carYear');
      const carColor = document.getElementById('carColor');
      const carAnnual = document.getElementById('carAnnualValid');
      const carLicense = document.getElementById('carLicenseValid');
      const carCriminal = document.getElementById('carCriminalRecord');

      if (!carMakeModel.value.trim()) { setFieldError(carMakeModel, 'يرجى كتابة النوع/الموديل'); isStageValid = false; } else clearFieldError(carMakeModel);
      if (!carPlate.value.trim()) { setFieldError(carPlate, 'يرجى كتابة رقم اللوحة'); isStageValid = false; } else clearFieldError(carPlate);
      if (!carYear.value.trim()) { setFieldError(carYear, 'يرجى كتابة سنة الصنع'); isStageValid = false; } else clearFieldError(carYear);
      if (!carColor.value.trim()) { setFieldError(carColor, 'يرجى كتابة اللون'); isStageValid = false; } else clearFieldError(carColor);
      
      if (!carAnnual.value) { setFieldError(carAnnual, 'يرجى الاختيار'); isStageValid = false; } else clearFieldError(carAnnual);
      if (!carLicense.value) { setFieldError(carLicense, 'يرجى الاختيار'); isStageValid = false; } else clearFieldError(carLicense);
      if (!carCriminal.value) { setFieldError(carCriminal, 'يرجى الاختيار'); isStageValid = false; } else clearFieldError(carCriminal);
    }
  }

  // المرحلة 4: الملاحظات
  if (stageNum === 4) {
    const notes = document.getElementById('notes');
    if (!notes.value.trim()) {
      setFieldError(notes, 'يرجى كتابة ملاحظة أو اكتب "لا يوجد"');
      isStageValid = false;
    } else {
      clearFieldError(notes);
    }
  }

  return isStageValid;
}

function setFieldError(inputEl, msg) {
  const block = inputEl.closest('.input-block');
  if (block) {
    block.classList.add('has-error');
    const err = block.querySelector('.field-error-msg');
    if (err) err.textContent = msg;
  }
}

function clearFieldError(inputEl) {
  const block = inputEl.closest('.input-block');
  if (block) block.classList.remove('has-error');
}

// ==========================================================================
// 6. إرسال الاستمارة + رسالة واتساب
// ==========================================================================
function initFormSubmission() {
  const form = document.getElementById('driverForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // التحقق من جميع المراحل الأربعة قبل الإرسال
    if (!validateStage(1) || !validateStage(2) || !validateStage(3) || !validateStage(4)) {
      alert('يرجى مراجعة الحقول المطلوبة والتأكد من إكمالها في جميع المراحل.');
      return;
    }

    // توليد رقم طلب مرجعي (BD تعني Baghdad Delivery)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const tempRefId = `BD-26-${randomNum}`;
    
    // إضافة التاريخ والوقت للرسالة
    const now = new Date();
    const dateString = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // البيانات العامة
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const altPhone = document.getElementById('alternatePhone').value.trim();
    const age = document.getElementById('birthDateOrAge').value.trim();
    
    // استخراج منطقة السكن مع دعم "منطقة أخرى"
    const districtSelect = document.getElementById('district');
    let finalDistrict = districtSelect.value;
    if (finalDistrict === 'منطقة أخرى في بغداد') {
      const otherInput = document.getElementById('otherDistrictInput');
      if (otherInput && otherInput.value.trim()) {
        finalDistrict = otherInput.value.trim();
      }
    }

    const landmark = document.getElementById('landmark').value.trim();

    // تجهيز تفاصيل المركبة حسب الاختيار الفعلي
    let vehicleType = '';
    let vehicleDetails = '';

    if (selectedVehicle === 'motorcycle') {
      vehicleType = '🏍️ دراجة نارية (ماطور)';
      const motoMakeModel = document.getElementById('motoMakeModel').value.trim();
      const motoPlate = document.getElementById('motoPlate').value.trim();
      const motoYear = document.getElementById('motoYear').value.trim();
      const motoColor = document.getElementById('motoColor').value.trim();
      const motoAnnual = document.getElementById('motoAnnualValid').value;
      const motoLicense = document.getElementById('motoLicenseValid').value;
      const motoCriminal = document.getElementById('motoCriminalRecord').value;

      vehicleDetails = `- النوع / الموديل: ${motoMakeModel}
- رقم اللوحة: ${motoPlate}
- سنة الصنع: ${motoYear}
- اللون: ${motoColor}
- هل السنوية نافذة؟: ${motoAnnual}
- هل تملك إجازة سوق نافذة؟: ${motoLicense}
- هل تملك عدم محكومية حديثة؟: ${motoCriminal}`;
    } else {
      vehicleType = '🚗 سيارة خاصة';
      const carMakeModel = document.getElementById('carMakeModel').value.trim();
      const carPlate = document.getElementById('carPlate').value.trim();
      const carYear = document.getElementById('carYear').value.trim();
      const carColor = document.getElementById('carColor').value.trim();
      const carAnnual = document.getElementById('carAnnualValid').value;
      const carLicense = document.getElementById('carLicenseValid').value;
      const carCriminal = document.getElementById('carCriminalRecord').value;

      vehicleDetails = `- النوع / الموديل: ${carMakeModel}
- رقم اللوحة: ${carPlate}
- سنة الصنع: ${carYear}
- اللون: ${carColor}
- هل السنوية نافذة؟: ${carAnnual}
- هل تملك إجازة سوق نافذة؟: ${carLicense}
- هل تملك عدم محكومية حديثة؟: ${carCriminal}`;
    }

    // الملاحظات
    const notes = document.getElementById('notes').value.trim();

    // تكوين الرسالة النهائية (مفصلة وواضحة جداً)
    const fullMessage = `📝 *طلب تسجيل كابتن توصيل جديد*
━━━━━━━━━━━━━━━━━━━━
🏢 *الشركة:* Alestimrar company (بغداد دلفري)
🔢 *المعرف المرجعي:* ${tempRefId}
📅 *التاريخ:* ${dateString} | ⏰ ${timeString}
━━━━━━━━━━━━━━━━━━━━

✅ *أولاً: تأكيد شروط التسجيل:*
- المركبة مرقمة وحاصلة على سنوية باسم المقدم: (نعم)
- يمتلك إجازة سوق نافذة: (نعم)
- يمتلك عدم محكومية حديثة: (نعم)
- العمر 18 سنة فما فوق: (نعم)

👤 *ثانياً: المعلومات الشخصية:*
- الاسم الثلاثي: ${fullName}
- رقم الهاتف (واتساب): ${phone}
- رقم الهاتف البديل: ${altPhone}
- العمر أو سنة التولد: ${age}
- منطقة السكن: ${finalDistrict}
- أقرب نقطة دالة: ${landmark}

${selectedVehicle === 'car' ? '🚗' : '🏍️'} *ثالثاً: معلومات المركبة:*
- نوع المركبة: ${vehicleType}
${vehicleDetails}

📌 *رابعاً: ملاحظات المتقدم:*
- ${notes}

━━━━━━━━━━━━━━━━━━━━
⚠️ *تنبيه هام جداً لإتمام التقديم:* ⚠️
عزيزي المتقدم، هذه الرسالة وحدها لا تعتبر تقديماً مكتملاً. يجب عليك فوراً إرسال *صور المستمسكات التالية* في *نفس هذه المحادثة*، وإلا سيتم إهمال ورفض الطلب نهائياً:

1️⃣ البطاقة الموحدة (الوجه الأمامي والخلفي)
2️⃣ بطاقة السكن (الوجه الأمامي والخلفي)
3️⃣ السنوية (الوجه الأمامي والخلفي)
4️⃣ إجازة السوق (الوجه الأمامي والخلفي)
5️⃣ صورة عدم المحكومية (حديثة الإصدار)
6️⃣ صورة سيلفي للمتقدم (خلفية بيضاء، واضحة وحديثة)

━━━━━━━━━━━━━━━━━━━━
شكراً لتقديمك، سيتم مراجعة طلبك ومستمسكاتك من قبل إدارة التوظيف قريباً.`;

    // تجهيز رابط wa.me
    const cleanNumber = COMPANY_WHATSAPP_NUMBER.replace(/\D/g, '');
    const encoded = encodeURIComponent(fullMessage);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

    // تعبئة عناصر المودال
    const modal = document.getElementById('waModal');
    const modalMsg = document.getElementById('modalMsgText');
    const modalLink = document.getElementById('modalOpenWaBtn');
    const modalRef = document.getElementById('modalRefText');
    const modalNum = document.getElementById('modalTargetNumber');

    if (modalRef) modalRef.textContent = tempRefId;
    if (modalMsg) modalMsg.textContent = fullMessage;
    if (modalLink) modalLink.href = waUrl;
    if (modalNum) modalNum.textContent = `+${cleanNumber}`;
    if (modal) modal.classList.add('active');

    // فتح واتساب في نافذة جديدة
    window.open(waUrl, '_blank');
  });
}

// ==========================================================================
// 7. أزرار المودال ونسخ الرسالة
// ==========================================================================
function initModalActions() {
  const modal = document.getElementById('waModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const copyBtn = document.getElementById('copyMsgBtn');
  const modalMsg = document.getElementById('modalMsgText');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (copyBtn && modalMsg) {
    copyBtn.addEventListener('click', () => {
      const text = modalMsg.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = 'تم النسخ بنجاح!';
          setTimeout(() => { copyBtn.textContent = 'نسخ النص بالكامل'; }, 3000);
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = 'تم النسخ بنجاح!';
        setTimeout(() => { copyBtn.textContent = 'نسخ النص بالكامل'; }, 3000);
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}