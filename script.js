const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form"); // .shopping-form u alıyoruz.
const filterButtons = document.querySelectorAll(".filter-buttons button");//".filter-buttons sınıfının altındaki buttonları liste halinde almak için querySelectorAll yazdık."
const clearBtn = document.querySelector(".clear");


// uygulama çalıştığı anda çalışmasını istediğimiz kodları bir noktadan yönetebiliriz.
document.addEventListener("DOMContentLoaded", function () {
    loadItems();
    updateState();
    shoppingForm.addEventListener("submit", handleFormSubmit); // submit eventi çağrıldığı anda handleFormSubmit fonksiyonu çağrılır.

    for (let button of filterButtons) {
        button.addEventListener("click", handleFilterSelection);//liste içerisindeki her elemana teker teker erişip bir click eventi eklemek için for döngüsü oluşturur.
    }

    clearBtn.addEventListener("click", clear)


});

function clear() {
    shoppingList.innerHTML = "";
    localStorage.clear("shoppingItems");
    updateState();
}

// listede eleman olmayınca alert çağıran fonksiyon
function updateState() {
    //Bu satır, listenin boş olup olmadığını kontrol eder.
    const isEmpty = shoppingList.querySelectorAll("li").length === 0;

    const alert = document.querySelector(".alert");
    const filterBtns = document.querySelector(".filter-buttons");


    // isEmpty true ise !isEmpty false olur, yani d-none sınıfı kaldırılır ve uyarı mesajı görünür hale gelir.
    // Liste boş değilse (yani isEmpty false ise), d-none sınıfı eklenir ve uyarı gizlenir.
    alert.classList.toggle("d-none", !isEmpty);
    clearBtn.classList.toggle("d-none", isEmpty);
    filterBtns.classList.toggle("d-none", isEmpty);
}

//o anda sayfada bulunan elementlerin hepsine ulaş ve bir liste halinde al.
function saveToLS() {
    const listItems = shoppingList.querySelectorAll("li");
    const liste = [];

    //aslında loadItems fonksiyonundaki id,name ve completed değerlerini almaya çalışıyoruz.
    for (let li of listItems) {
        const id = li.getAttribute("item-id");
        const name = li.querySelector(".item-name").textContent;
        const completed = li.hasAttribute("item-completed");

        liste.push({ id, name, completed });
    }

    //localStorage: Web tarayıcısının sağladığı bir özellik olup,
    // kullanıcı tarayıcısını kapatıp açsa bile veri kaybetmeden kalıcı olarak saklanmasını sağlar. Bu sayede, uygulamanızın bir dahaki açılışında veriler aynı şekilde kalır.

    // JSON.stringify(liste): localStorage yalnızca düz metin (string) veriyi saklayabildiğinden, 
    // liste nesnesini JSON formatında bir metne çevirir. Bu işlem JSON.stringify ile yapılır ve liste içerisindeki id, name, 
    // completed gibi bilgiler bir metne dönüştürülür.

    localStorage.setItem("shoppingItems", JSON.stringify(liste));

}


function loadItems() {
    // const items = [
    //     // completed tamamlanmış bir görev olup olmadığını sorgular
    //     { id: 1, name: "Yumurta", completed: false },
    //     { id: 2, name: "Balık", completed: true },
    //     { id: 3, name: "Süt", completed: false },
    //     { id: 4, name: "Zeytin", completed: false },
    // ]

    // Json.parse diyerek localStorage üzerinden getItem ile almış olduğumuz "shoppingItems"
    // keyıne sahip olan string elemanı al getItem aracılığıyla bunu parse edicez.
    // parse etmek = uygulama tarafında kullanılabilecek liste tipine,veri tipine,obje tipine çevirmek
    const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];

    // sayfa her yüklendiğinde shoppingList sıfırlansın
    shoppingList.innerHTML = "";

    // 1.YOL
    // for (let item of items) {
    //     shoppingList.innerHTML += `
    //     <li class="border rounded p-3 mb-1">
    //         <input type="checkbox" class="form-check-input">
    //         <div class="item-name">${item.name}</div>
    //         <i class="fs-3 bi bi-x text-danger delete-icon"></i>
    //     </li>`;
    // }

    //2.YOL
    // Aslında yukarıdaki li yapısının içeriğini oluşturuyoruz.
    for (let item of items) {
        const li = createListItem(item); //aşağıdaki fonksiyonda oluşturulan li elementi buraya gelecek.
        shoppingList.appendChild(li); // li elementi shoppingList altına eklenir.
    }
}

function addItem(input) {
    //itemleri loadItem fonksiyonundaki elementlerle aynı formatta göndermemiz gerekiyor

    const id = generateId();
    console.log(id);
    const newItem = createListItem({
        id: id,
        name: input.value,
        completed: false
    });

    shoppingList.appendChild(newItem);
    //shoppingList.prepend(newItem);elemanları listenin en başına eklemek istersek

    // inputun valuesını sıfırladık.
    input.value = "";

    updateFilterItems();
    //yeni eleman eklediğimiz anda listede görebileceğiz.
    saveToLS();
    updateState();
}

//rastgele bir id oluşturan bir fonksiyon tanımladık.
function generateId() {
    return Date.now().toString(); //Date.now o anki tarih saatin ms karşılığını gönderecek.
}

function handleFormSubmit(e) {
    // sayfanın yenilenmesini engellemek için.
    // çünkü çıktıyı göremiyoruz sayfa otomatik yenilendiği için
    e.preventDefault();
    const input = document.getElementById("item_name"); //inputa girilen değeri alıyoruz.

    //trim = inputa veri girerken sağ ve sol kenardan boşluk bırakıldıysa onu kapatır.
    if (input.value.trim().length == 0) { // length = 0 ise herhangi bir değer girilmemiştir
        alert("yeni değer giriniz.");
        return; // eğer boşsa aşağıdaki kodlar çalıştırılmasın.
    }

    addItem(input); // neden .value yazmadık? Çünkü değeri gönderdikten sonra inputun içindeki değeri sıfırlayacağız.

}

//checkbox seçildiği anda checkbox ın parent elementine giderek "item-completed" özelliğini ekleyeceğiz veya kaldıracağız.
function toggleCompleted(e) { // e parametresi,checkbox'ın değişim eventini temsil eder.
    const li = e.target.parentElement;// checkbox'ın bulunduğu <li> elementini seçiyoruz.
    li.toggleAttribute("item-completed", e.target.checked); // Eğer checkbox seçiliyse (true), 'item-completed' attribute'u eklenir; değilse kaldırılır.

    updateFilterItems();
    saveToLS();
}


function createListItem(item) {
    //checkbox
    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("form-check-input");
    input.checked = item.completed;
    //checkbox ın seçimi değiştiği anda tetiklenmesini istediğimiz değer
    input.addEventListener("change", toggleCompleted);

    //item
    const div = document.createElement("div");
    div.textContent = item.name;
    div.classList.add("item-name");
    div.addEventListener("click", openEditMode); //elemanları düzenlemek için bir fonksiyon ekliyoruz.
    div.addEventListener("blur", closeEditMode); //edit modunu kapatmak için bir function
    div.addEventListener("keydown", cancelEnter);; // düzenleme yaparken bir alt satıra geçilmesini engellemek için

    // delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fs-3 bi bi-x text-danger delete-icon";
    deleteIcon.addEventListener("click", removeItem);

    // li
    const li = document.createElement("li");
    li.setAttribute("item-id", item.id);
    li.className = "border rounded p-2 mb-1";
    //li elementine bu metotla ekstra bir attribute ekleyeceğiz.
    //item.competed=true ise çizgi ekleyeceğiz üstüne,false ise eklenmeyecek.
    li.toggleAttribute("item-completed", item.completed); //toggleAttribute metodu, bir attribute eklemek veya kaldırmak için kullanılır.


    // li nin içerisine child elementleri eklendi.
    li.appendChild(input);
    li.appendChild(div);
    li.appendChild(deleteIcon);

    return li;

}

function removeItem(e) {
    const li = e.target.parentElement;//burda i etiketine ulaşıyoruz.daha sonra onun parentElemntini alarak o iconun li etiketine ulaşmış oluyoruz.
    shoppingList.removeChild(li);

    // bir elemanı sildiğimiz anda liste üzerinden de silinsin.
    saveToLS();
    updateState();

}

function openEditMode(e) {
    const li = e.target.parentElement;//önce div e sonra li ye ulaşıyoruz.
    // item-completed değerinin olup olmadığını kontrol ediyoruz.
    // çünkü eleman true ise zaten üstü çizilidir yani düzenlenemez.
    if (li.hasAttribute("item-completed") == false) {
        e.target.contentEditable = true; // güncelleme açıldı.
    }
}

// input alanından başka alana tıklandığında edit modunu kapatır.
function closeEditMode(e) {
    e.target.contentEditable = false;

    saveToLS();
}


//edit yaparken bir alt satıra geçilmesini engellemek için function
function cancelEnter(e) {
    if (e.key == "Enter") {
        e.preventDefault(); // bir alt satıra geçme
        closeEditMode(e); // edit modundan çık
    }
}

// seçili olan butona primary,olmayanlara secondary classını ekleyen fonksiyon
function handleFilterSelection(e) {
    const filterBtn = e.target; // seçili olanı aldık.

    for (let button of filterButtons) {
        //seçili olmayanlara secondary ekleyecek,seçili olan varsa da primary classını kaldıracak.
        button.classList.add("btn-secondary");
        button.classList.remove("btn-primary");
    }

    filterBtn.classList.add("btn-primary");
    filterBtn.classList.remove("btn-secondary");

    //Hangi butona tıkladığımızı filterItems metoduna gönderdik.
    filterItems(filterBtn.getAttribute("item-filter"));
}

function filterItems(filterType) {
    const li_items = shoppingList.querySelectorAll("li");// bütün li elemanlarını al

    // liste elemanlarına tek tek ulaşıp her ulaşmada bu işlemleri tekrar ettir.
    for (let li of li_items) {

        // bütün li elementlerini göstermek ya da kaybetmek için kullandığımız classları her seferinde silelim.
        li.classList.remove("d-flex");
        li.classList.remove("d-none");

        const item_completed = li.hasAttribute("item-completed");// li elementi item-completed mı diye kontrol edeceğiz.
        if (filterType == "completed") {
            // tamamlananları göster(completed elementinde item-completed varsa o eleman gösterilsin,yoksa d-none)
            li.classList.toggle(item_completed ? "d-flex" : "d-none");
        } else if (filterType == "incomplete") {
            // tamamlanmayanları göster
            li.classList.toggle(item_completed ? "d-none" : "d-flex");
        } else {
            // hepsini göster
            li.classList.toggle("d-flex");

        }
    }

}

// herhangi bir li elementini örneğin completed yaptığımız anda completed kısmına geçmesi için fonksiyon
function updateFilterItems() {
    // o anki aktif olan butonu seçtik.
    const activeFilter = document.querySelector(".btn-primary[item-filter]");
    filterItems(activeFilter.getAttribute("item-filter"));

}



