const fomelo2templateHash = {
    "ac": "armor-class",
    "agi":"agi",
    "aggression":"aggression",
    "atk delay": "attack-delay",
    "cha":"cha",
    "class":"class",
    "critical strike":"critical-strike",
    "dex":"dex",
    "dmg":"damage",
    "effect":"focus-effect",
    "flowing thought":"mana-regen",
    "hp":"health",
    "icon":"icon",
    "int":"int",
    "item-flag":"item-flag",
    "item-name":"item-name",
    "mana":"mana",
    "mr":"save-v-magic",
    "cr":"save-v-cold",
    "fr":"save-v-fire",
    "pr":"save-v-poison",
    "dr":"save-v-disease",
    "race":"race",
    "ratio":"ratio_",
    "recommended-level":"recommended-level",
    "required-level":"required-level",
    "size":"size",
    "skill": "weapon-skill",
    "skill mod":"skill-modifier-type",
    "slot":"slot",
    "spell ward":"spellward",
    "sta":"sta",
    "str":"str",
    "stun resist": "stun-resist",
    "weight":"weight",
    "wis":"wis",
    "unassigned": [
        "hp-regen",
        "mind-shield",
        "damage-reduction",
        "augment-slot-types",
        "skill-modifier-amount",
        "bane-damage-type",
        "bane-damage-amount"
    ]
};


function itemToReadable (){
    let results = [];
    document.querySelectorAll('.tip').forEach((itemNode) => {
        let details = itemNode.querySelectorAll('font');
        let iconNumRegex = /.*item_(\d+)\.png/;
        let iconNode = details[1].querySelector('img');
        let icon = '3795'; //broken heart default icon
        if(iconNode !== null && iconNode.src) {
            icon = iconNode.src.replace(iconNumRegex, "$1");
        }
        let stats = details[1].querySelectorAll('br ~ b');
        let detailsText = details[1].textContent.replaceAll('\n','');
        let detailsArr = [];
        let detailsObj = { misc: []};
        


        stats.forEach((stat) => {
            let textContent = stat.textContent;
            detailsText = detailsText.replace(`${textContent}`, `~~${textContent}`);
        });

        detailsArr = detailsText.split('~~');
        detailsArr = detailsArr.map((detail) => {
            return detail.split('\:');
        });

        let loreNode = itemNode.querySelector('.lore');
        let loreText = null;
        if(loreNode) {
            loreText = loreNode.textContent;
            detailsObj.lore = loreText;
            detailsArr[detailsArr.length-1][1] = detailsArr[detailsArr.length-1][1].replace(loreText, '');
        }


        detailsArr.forEach((detail) => {
            if(detail.length >= 2) {
                let key = fomelo2templateHash[detail[0].toLocaleLowerCase()];
                detailsObj[key] = detail.slice(1).map(desc => desc.trim()).join(' ').replace('+','');
            } else if(detail.length === 1) {
                detailsObj['misc'].push(detail[0])
            }
        });

        detailsObj['misc'].forEach((miscItem, index) => {
            if(index === 0) {
                detailsObj['item-flag'] = miscItem.replaceAll('[', '').replaceAll(']', '').trim();
                return;
            }

            if(miscItem.search('Recommended') >= 0) {
                detailsObj['recommended-level'] = miscItem.replace(/[^\d]+(\d+)/, "$1");
                return;
            }

            if(miscItem.search('Required') >= 0) {
                detailsObj['required-level'] = miscItem.replace(/[^\d]+(\d+)/, "$1");
                return;
            }
        });

        results.push({
            'item-name': details[0].textContent.replaceAll('\n',''),
            icon: icon,
            ...detailsObj
        });
        //augs will be at details index 2+, so you can loop on those too  
    });

    return results;
}



function printTemplate(arr) {
    let itemTemplates = {};
    let startOfTemplate = "{{Item\n";
    let endOfTemplate = "}}"
    arr.forEach(item => {

        let thisTemplate = startOfTemplate;
        Object.keys(item).forEach(key => {
            thisTemplate += `|${key}=${item[key]}\n`;
        });
        thisTemplate += endOfTemplate;
        itemTemplates[item["item-name"]] = thisTemplate;
    })

    console.log(itemTemplates);
}

let result = itemToReadable();
printTemplate(result);
