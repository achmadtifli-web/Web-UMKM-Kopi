// ===============================
// JavaScript Interaktif Kopi Komar
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("orderForm");
    const product = document.getElementById("produk_pesanan");
    const quantity = document.getElementById("jumlah");
    const message = document.getElementById("pesan");
    const summary = document.getElementById("orderSummary");
    const summaryProduct = document.getElementById("summaryProduct");
    const summaryQuantity = document.getElementById("summaryQuantity");
    const summaryShipping = document.getElementById("summaryShipping");
    const summaryTotal = document.getElementById("summaryTotal");
    const charCounter = document.getElementById("charCounter");
    const backToTop = document.getElementById("backToTop");
    const toast = document.getElementById("toast");

    // ===============================
    // Checkout + Struk + Riwayat
    // ===============================

    const receiptModal = document.getElementById("receiptModal");
    const closeReceipt = document.getElementById("closeReceipt");
    const closeReceiptBottom = document.getElementById("closeReceiptBottom");
    const printReceipt = document.getElementById("printReceipt");
    const resetOrder = document.getElementById("resetOrder");
    const orderHistoryBox = document.getElementById("orderHistoryBox");
    const orderHistory = document.getElementById("orderHistory");
    const clearHistory = document.getElementById("clearHistory");

    let currentOrder = null;
    let appliedPromo = null;

    const paymentMethod = document.getElementById("paymentMethod");
    const promoCode = document.getElementById("promoCode");
    const applyPromo = document.getElementById("applyPromo");
    const promoMessage = document.getElementById("promoMessage");
    const discountRow = document.getElementById("discountRow");
    const discountAmount = document.getElementById("discountAmount");

    const statOrders = document.getElementById("statOrders");
    const statSpending = document.getElementById("statSpending");
    const statLastOrder = document.getElementById("statLastOrder");
    const statStatus = document.getElementById("statStatus");

    const ratingModal = document.getElementById("ratingModal");
    const ratingComment = document.getElementById("ratingComment");
    const submitRating = document.getElementById("submitRating");
    const skipRating = document.getElementById("skipRating");

    let selectedRating = 0;

    // Helper modal & keamanan teks
    function openModal(el) {
        el.classList.remove("hidden");
        el.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeModal(el) {
        el.classList.add("hidden");
        el.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // Harga produk
    const prices = {
        gayo: 85000,
        toraja: 90000,
        flores: 88000
    };

    const productNames = {
        gayo: "Kopi Gayo Aceh",
        toraja: "Kopi Toraja",
        flores: "Kopi Flores Bajawa"
    };

    const shippingPrices = {
        reguler: 0,
        ekspres: 15000
    };

    // Format Rupiah
    function formatRupiah(number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(number);
    }

    // Tampilkan notifikasi kecil
    function showToast(text, type = "success") {
        toast.textContent = text;
        toast.classList.remove("hidden", "bg-green-700", "bg-red-700");
        toast.classList.add(type === "error" ? "bg-red-700" : "bg-green-700");

        clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            toast.classList.add("hidden");
        }, 3500);
    }

    // Hitung dan tampilkan ringkasan pesanan
    function updateSummary() {
        const qty = Number(quantity.value);

        if (!Number.isInteger(qty) || qty < 1) {
            summary.classList.add("hidden");
            discountRow.classList.add("hidden");
            return;
        }

        const shipping = document.querySelector('input[name="pengiriman"]:checked').value;
        const subtotal = prices[product.value] * qty;
        const discount = calculateDiscount(subtotal);
        const total = Math.max(0, subtotal - discount + shippingPrices[shipping]);

        summary.classList.remove("hidden");

        if (discount > 0) {
            discountRow.classList.remove("hidden");
            discountAmount.textContent = "-" + formatRupiah(discount);
        } else {
            discountRow.classList.add("hidden");
            discountAmount.textContent = "-Rp0";
        }
        summaryProduct.textContent = productNames[product.value];
        summaryQuantity.textContent = qty + " pak (250 g)";
        summaryShipping.textContent =
            shipping === "ekspres"
                ? "Ekspres (+Rp15.000)"
                : "Reguler";
        summaryTotal.textContent = formatRupiah(total);
    }

    product.addEventListener("change", updateSummary);
    quantity.addEventListener("input", updateSummary);

    document.querySelectorAll('input[name="pengiriman"]').forEach(function (radio) {
        radio.addEventListener("change", updateSummary);
    });

    // Penghitung karakter pesan
    message.addEventListener("input", function () {
        charCounter.textContent = message.value.length + "/200 karakter";
    });

    // Animasi ringan saat gambar galeri disentuh
    document.querySelectorAll("#Galeri figure img").forEach(function (image) {
        image.classList.add("cursor-zoom-in", "transition", "duration-300");

        image.addEventListener("click", function () {
            const overlay = document.createElement("div");
            overlay.className =
                "fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out";

            const largeImage = document.createElement("img");
            largeImage.src = image.src;
            largeImage.alt = image.alt;
            largeImage.className =
                "max-h-[90vh] max-w-[95vw] rounded-xl shadow-2xl";

            overlay.appendChild(largeImage);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", function () {
                overlay.remove();
            });
        });
    });

    // Smooth scroll untuk menu navigasi
    document.querySelectorAll('nav a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Tombol kembali ke atas
    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            backToTop.classList.remove("hidden");
        } else {
            backToTop.classList.add("hidden");
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Kode promo
    applyPromo.addEventListener("click", function () {
        const code = promoCode.value.trim().toUpperCase();

        if (code === "KOPI10") {
            appliedPromo = "KOPI10";
            promoMessage.textContent = "✓ Promo KOPI10 aktif: diskon 10%.";
            promoMessage.className = "text-xs text-green-600 font-medium";
            promoCode.classList.add("border-green-500");
            showToast("Kode promo berhasil digunakan.");
        } else if (code === "") {
            appliedPromo = null;
            promoMessage.textContent = "Masukkan kode promo terlebih dahulu.";
            promoMessage.className = "text-xs text-red-600";
        } else {
            appliedPromo = null;
            promoMessage.textContent = "Kode promo tidak ditemukan.";
            promoMessage.className = "text-xs text-red-600";
            showToast("Kode promo tidak valid.", "error");
        }

        updateSummary();
    });

    promoCode.addEventListener("input", function () {
        promoCode.value = promoCode.value.toUpperCase();
    });

    function getPaymentName(value) {
        const names = {
            qris: "QRIS",
            transfer: "Transfer Bank",
            cod: "COD"
        };

        return names[value] || value;
    }

    function calculateDiscount(subtotal) {
        if (appliedPromo === "KOPI10") {
            return Math.round(subtotal * 0.10);
        }

        return 0;
    }

    function updateDashboard() {
        const orders = getOrders();

        statOrders.textContent = orders.length;

        const spending = orders.reduce(function (total, order) {
            return total + Number(order.total || 0);
        }, 0);

        statSpending.textContent = formatRupiah(spending);

        if (orders.length > 0) {
            statLastOrder.textContent = orders[0].id;
            statStatus.textContent = orders[0].status || "Diproses";
        } else {
            statLastOrder.textContent = "-";
            statStatus.textContent = "Belum ada pesanan";
        }
    }

    function getNextStatus(order) {
        const stages = ["Diproses", "Disiapkan", "Dikirim", "Selesai"];
        const currentIndex = stages.indexOf(order.status || "Diproses");

        return stages[Math.min(currentIndex + 1, stages.length - 1)];
    }

    function getStatusProgress(status) {
        const progress = {
            Diproses: 25,
            Disiapkan: 50,
            Dikirim: 75,
            Selesai: 100
        };

        return progress[status] || 25;
    }

    function updateReceiptStatus(order) {
        const status = order.status || "Diproses";
        const progress = getStatusProgress(status);

        document.getElementById("receiptStatus").textContent = status;
        document.getElementById("receiptProgress").style.width = progress + "%";

        const texts = {
            Diproses: "Pesanan sudah diterima dan sedang diproses.",
            Disiapkan: "Pesanan sedang disiapkan oleh Kopi Komar.",
            Dikirim: "Pesanan sedang dalam perjalanan.",
            Selesai: "Pesanan selesai. Selamat menikmati kopinya!"
        };

        document.getElementById("receiptStatusText").textContent =
            texts[status] || texts.Diproses;
    }

    function advanceOrderStatus(orderId) {
        const orders = getOrders();
        const index = orders.findIndex(function (item) {
            return item.id === orderId;
        });

        if (index === -1) {
            return;
        }

        orders[index].status = getNextStatus(orders[index]);
        localStorage.setItem("kopiKomarOrders", JSON.stringify(orders));

        const updatedOrder = orders[index];
        showReceipt(updatedOrder);
        renderOrderHistory();
        updateDashboard();
        showToast("Status pesanan: " + updatedOrder.status);

        if (updatedOrder.status === "Selesai" && !updatedOrder.rating) {
            setTimeout(function () {
                hideReceipt();
                openRating(updatedOrder);
            }, 700);
        }
    }

    // ===============================
    // Rating Pelanggan
    // ===============================

    document.querySelectorAll(".rating-star").forEach(function (star) {
        star.addEventListener("click", function () {
            selectedRating = Number(this.dataset.rating);

            document.querySelectorAll(".rating-star").forEach(function (item) {
                const rating = Number(item.dataset.rating);
                item.classList.toggle("text-amber-500", rating <= selectedRating);
                item.classList.toggle("text-gray-300", rating > selectedRating);
            });
        });
    });

    function openRating(order) {
        ratingModal.dataset.orderId = order.id;
        selectedRating = 0;
        ratingComment.value = "";

        document.querySelectorAll(".rating-star").forEach(function (star) {
            star.classList.remove("text-amber-500");
            star.classList.add("text-gray-300");
        });

        openModal(ratingModal);
    }

    function closeRating() {
        closeModal(ratingModal);
    }

    submitRating.addEventListener("click", function () {
        if (selectedRating === 0) {
            showToast("Pilih rating terlebih dahulu.", "error");
            return;
        }

        const orders = getOrders();
        const orderIndex = orders.findIndex(function (item) {
            return item.id === ratingModal.dataset.orderId;
        });

        if (orderIndex !== -1) {
            orders[orderIndex].rating = selectedRating;
            orders[orderIndex].ratingComment = ratingComment.value.trim();
            localStorage.setItem("kopiKomarOrders", JSON.stringify(orders));
        }

        closeRating();
        renderOrderHistory();
        updateDashboard();
        showToast("Terima kasih atas rating kamu! ⭐");
    });

    skipRating.addEventListener("click", closeRating);


    function createOrderId() {
        const now = new Date();
        const random = Math.floor(1000 + Math.random() * 9000);
        return "KK-" +
            now.getFullYear().toString().slice(-2) +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0") +
            "-" + random;
    }

    function getShippingName(value) {
        return value === "ekspres" ? "Ekspres" : "Reguler";
    }

    function getDateTime() {
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
            timeStyle: "short"
        }).format(new Date());
    }

    function getOrders() {
        try {
            return JSON.parse(localStorage.getItem("kopiKomarOrders")) || [];
        } catch (error) {
            return [];
        }
    }

    function saveOrder(order) {
        const orders = getOrders();
        orders.unshift(order);

        // Simpan maksimal 20 transaksi terakhir
        localStorage.setItem(
            "kopiKomarOrders",
            JSON.stringify(orders.slice(0, 20))
        );
    }

    function renderOrderHistory() {
        const orders = getOrders();

        if (orders.length === 0) {
            orderHistoryBox.classList.add("hidden");
            orderHistory.innerHTML = "";
            return;
        }

        orderHistoryBox.classList.remove("hidden");
        orderHistory.innerHTML = orders.map(function (o) {
            const stars = o.rating
                ? '<span class="text-amber-500 text-xs">' + "★".repeat(o.rating) + "☆".repeat(5 - o.rating) + "</span>"
                : "";
            const rateButton = o.status === "Selesai" && !o.rating
                ? '<button type="button" data-action="rate" data-id="' + escapeHtml(o.id) + '" class="text-xs text-amber-700 hover:underline">Beri Rating</button>'
                : "";

            return `
                <div class="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3 bg-white">
                    <div class="min-w-0">
                        <p class="font-semibold text-sm text-amber-800">${escapeHtml(o.id)}</p>
                        <p class="text-xs text-gray-500 truncate">${escapeHtml(o.product)} × ${escapeHtml(o.quantity)}</p>
                        <p class="text-xs text-gray-400">${escapeHtml(o.date)}</p>
                        <span class="inline-block mt-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700">${escapeHtml(o.status || "Diproses")}</span>
                        ${stars}
                    </div>
                    <div class="text-right shrink-0 flex flex-col items-end gap-1">
                        <p class="font-bold text-sm">${formatRupiah(o.total)}</p>
                        <button type="button" data-action="receipt" data-id="${escapeHtml(o.id)}" class="text-xs text-amber-700 hover:underline">Lihat Struk</button>
                        <button type="button" data-action="reorder" data-id="${escapeHtml(o.id)}" class="text-xs text-amber-700 hover:underline">Pesan Lagi</button>
                        ${rateButton}
                    </div>
                </div>`;
        }).join("");
    }

    // Fitur baru: Pesan Lagi (isi ulang form dari pesanan lama)
    function reorder(order) {
        const key = Object.keys(productNames).find(function (k) {
            return productNames[k] === order.product;
        });
        if (key) product.value = key;

        quantity.value = order.quantity;
        paymentMethod.value = order.payment || "qris";

        const radio = document.querySelector('input[name="pengiriman"][value="' + order.shipping + '"]');
        if (radio) radio.checked = true;

        updateSummary();
        document.getElementById("Pemesanan").scrollIntoView({ behavior: "smooth" });
        showToast("Pesanan sebelumnya dimuat. Lengkapi data lalu kirim.");
    }

    orderHistory.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const order = getOrders().find(function (item) {
            return item.id === button.dataset.id;
        });
        if (!order) return;

        if (button.dataset.action === "receipt") showReceipt(order);
        else if (button.dataset.action === "rate") openRating(order);
        else if (button.dataset.action === "reorder") reorder(order);
    });

    function showReceipt(order) {
        currentOrder = order;

        document.getElementById("receiptOrderId").textContent = order.id;
        document.getElementById("receiptDate").textContent = order.date;
        document.getElementById("receiptName").textContent = order.name;
        document.getElementById("receiptEmail").textContent = order.email;
        document.getElementById("receiptProduct").textContent = order.product;
        document.getElementById("receiptQty").textContent =
            order.quantity + " pak × " + formatRupiah(order.unitPrice);
        document.getElementById("receiptSubtotal").textContent =
            formatRupiah(order.subtotal);
        document.getElementById("receiptSubtotalDetail").textContent =
            formatRupiah(order.subtotal);
        document.getElementById("receiptShipping").textContent =
            order.shippingPrice === 0
                ? "Gratis"
                : getShippingName(order.shipping) + " (" + formatRupiah(order.shippingPrice) + ")";
        document.getElementById("receiptTotal").textContent =
            formatRupiah(order.total);
        document.getElementById("receiptMessage").textContent =
            order.message || "Tidak ada catatan tambahan.";

        updateReceiptStatus(order);

        document.getElementById("receiptPayment").textContent = getPaymentName(order.payment);

        const discountLine = document.getElementById("receiptDiscountRow");
        if (order.discount > 0) {
            discountLine.classList.remove("hidden");
            document.getElementById("receiptDiscount").textContent =
                "-" + formatRupiah(order.discount) + (order.promo ? " (" + order.promo + ")" : "");
        } else {
            discountLine.classList.add("hidden");
        }

        const advanceButton = document.getElementById("advanceStatus");
        if (advanceButton) {
            advanceButton.remove();
        }

        if (order.status !== "Selesai") {
            const button = document.createElement("button");
            button.id = "advanceStatus";
            button.type = "button";
            button.className =
                "no-print w-full mt-3 border border-blue-200 text-blue-700 rounded-lg py-2 text-sm font-medium hover:bg-blue-50 transition";
            button.textContent = "Simulasikan Status Berikutnya →";
            button.addEventListener("click", function () {
                advanceOrderStatus(order.id);
            });

            document.getElementById("receiptStatusText").parentElement.appendChild(button);
        }

        openModal(receiptModal);
    }

    function hideReceipt() {
        closeModal(receiptModal);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("nama").value.trim();
        const email = document.getElementById("email").value.trim();
        const qty = Number(quantity.value);

        if (name.length < 3) {
            showToast("Nama minimal 3 karakter.", "error");
            document.getElementById("nama").focus();
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            showToast("Masukkan email yang valid.", "error");
            document.getElementById("email").focus();
            return;
        }

        if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
            showToast("Jumlah pesanan harus 1–99.", "error");
            quantity.focus();
            return;
        }

        const shipping = document.querySelector(
            'input[name="pengiriman"]:checked'
        ).value;

        const subtotal = prices[product.value] * qty;
        const shippingPrice = shippingPrices[shipping];
        const discount = calculateDiscount(subtotal);
        const total = Math.max(0, subtotal - discount + shippingPrice);

        const order = {
            id: createOrderId(),
            date: getDateTime(),
            name: name,
            email: email,
            product: productNames[product.value],
            quantity: qty,
            unitPrice: prices[product.value],
            shipping: shipping,
            shippingPrice: shippingPrice,
            subtotal: subtotal,
            discount: discount,
            promo: appliedPromo,
            payment: paymentMethod.value,
            total: total,
            status: "Diproses",
            message: message.value.trim()
        };

        saveOrder(order);
        renderOrderHistory();
        updateDashboard();
        showReceipt(order);

        showToast("Pesanan berhasil dibuat! Struk sudah tersedia.");

        form.reset();
        appliedPromo = null;
        promoMessage.textContent = "Gunakan KOPI10 untuk diskon 10%.";
        promoMessage.className = "text-xs text-gray-500";
        promoCode.classList.remove("border-green-500");
        charCounter.textContent = "0/200 karakter";
        updateSummary();
    });

    closeReceipt.addEventListener("click", hideReceipt);
    closeReceiptBottom.addEventListener("click", hideReceipt);

    receiptModal.addEventListener("click", function (event) {
        if (event.target === receiptModal) {
            hideReceipt();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !receiptModal.classList.contains("hidden")) {
            hideReceipt();
        }
    });

    printReceipt.addEventListener("click", function () {
        if (currentOrder) window.print();
    });

    // Fitur baru: kirim pesanan ke WhatsApp penjual
    document.getElementById("whatsappReceipt").addEventListener("click", function () {
        if (!currentOrder) return;

        const o = currentOrder;
        const lines = [
            "Halo Kopi Komar, saya ingin konfirmasi pesanan:",
            "No. Pesanan: " + o.id,
            "Nama: " + o.name,
            "Produk: " + o.product + " × " + o.quantity,
            "Pengiriman: " + getShippingName(o.shipping),
            "Pembayaran: " + getPaymentName(o.payment),
            "Total: " + formatRupiah(o.total)
        ];
        if (o.message) lines.push("Catatan: " + o.message);

        window.open(
            "https://wa.me/6281234567890?text=" + encodeURIComponent(lines.join("\n")),
            "_blank",
            "noopener"
        );
    });

    if (resetOrder) {
        resetOrder.addEventListener("click", function () {
            form.reset();
            appliedPromo = null;
            promoMessage.textContent = "Gunakan KOPI10 untuk diskon 10%.";
            promoMessage.className = "text-xs text-gray-500";
            promoCode.classList.remove("border-green-500");
            charCounter.textContent = "0/200 karakter";
            updateSummary();
            showToast("Form pesanan sudah direset.");
        });
    }

    clearHistory.addEventListener("click", function () {
        if (confirm("Hapus semua riwayat pesanan?")) {
            localStorage.removeItem("kopiKomarOrders");
            renderOrderHistory();
            updateDashboard();
            showToast("Riwayat pesanan dihapus.");
        }
    });

    renderOrderHistory();
    updateDashboard();

    // Animasi masuk sederhana ketika section terlihat
    const sections = document.querySelectorAll("main section");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "transition",
                        "duration-700",
                        "opacity-100",
                        "translate-y-0"
                    );
                }
            });
        },
        { threshold: 0.12 }
    );

    sections.forEach(function (section) {
        section.classList.add(
            "opacity-0",
            "translate-y-4"
        );
        observer.observe(section);
    });

    // Jalankan ringkasan pertama kali
    updateSummary();
});
