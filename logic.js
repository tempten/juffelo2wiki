
function _fomelo2wiki () {
  const fomelo2templateHash = {
    "ac": "armor-class",
    "agi":"agi",
    "aggression":"aggression",
    "atk delay": "attack-delay",
    "bane dmg": "bane-damage-amount",
    "cha":"cha",
    "class":"class",
    "cold dmg":"elemental-damage-type=Cold\n|elemental-damage-amount",
    "cr":"save-v-cold",
    "critical strike":"critical-strike",
    "damage reduction":"damage-reduction",
    "dex":"dex",
    "disease dmg":"elemental-damage-type=Disease\n|elemental-damage-amount",
    "dmg":"damage",
    "dr":"save-v-disease",
    "effect":"effect",
    "fire dmg":"elemental-damage-type=Fire\n|elemental-damage-amount",
    "flowing thought":"mana-regen",
    "focus effect":"focus-effect",
    "fr":"save-v-fire",
    "haste":"haste",
    "hp":"health",
    "icon":"icon",
    "instrument modifier": "instrument-modifier-type",
    "int":"int",
    "item-flag":"item-flag",
    "item-name":"item-name",
    "magic dmg":"elemental-damage-type=Magic\n|elemental-damage-amount",
    "mana":"mana",
    "mind shield":"mind-shield",
    "mr":"save-v-magic",
    "poison dmg":"elemental-damage-type=Poison\n|elemental-damage-amount",
    "pr":"save-v-poison",
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
    "type 1 aug slot":"augment-slot-types",
    "type 2 aug slot":"augment-slot-types",
    "type 3 aug slot":"augment-slot-types",
    "type 4 aug slot":"augment-slot-types",
    "type 5 aug slot":"augment-slot-types",
    "type 6 aug slot":"augment-slot-types",
    "type 7 aug slot":"augment-slot-types",
    "type 8 aug slot":"augment-slot-types",
    "type 9 aug slot":"augment-slot-types",
    "type 10 aug slot":"augment-slot-types",
    "type 11 aug slot":"augment-slot-types",
    "type 12 aug slot":"augment-slot-types",
    "type 13 aug slot":"augment-slot-types",
    "type 29 aug slot":"augment-slot-types",
    "weight":"weight",
    "wis":"wis",
    "unassigned": [
        "hp-regen",
        "augment-slot-types",
        "bane-damage-type",
        "bane-damage-amount",
        "instrument modifier"
    ]
  };
  
  
  function itemToReadable (){
    let results = [];
    document.querySelectorAll(".tip").forEach((itemNode) => {
        let details = itemNode.querySelectorAll("font");
        let iconNumRegex = /.*item_(\d+)\.png/;
        let iconNode = details[1].querySelector("img");
        let icon = "3795"; //broken heart default icon
        if(iconNode !== null && iconNode.src) {
            icon = iconNode.src.replace(iconNumRegex, "$1");
        }
        let stats = details[1].querySelectorAll("br ~ b");
        let detailsText = details[1].textContent.replaceAll("\n","");
        let detailsArr = [];
        let detailsObj = { misc: [], loot: ""};
        
        stats.forEach((stat) => {
            let textContent = stat.textContent;
            detailsText = detailsText.replace(`${textContent}`, `~~${textContent}`);
        });
        detailsText = detailsText.replace(`Focus ~~Effect`, `Focus Effect`);
        detailsArr = detailsText.split("~~");
        detailsArr = detailsArr.map((detail) => {
            return detail.split("\:");
        });
  
        let loreNode = itemNode.querySelector(".lore");
        let loreText = null;
        if(loreNode) {
            loreText = loreNode.textContent;
            detailsObj.lore = loreText;
            detailsArr[detailsArr.length-1][1] = detailsArr[detailsArr.length-1][1].replace(loreText, "");
        }

        detailsArr.forEach((detail) => {
            if(detail.length >= 2) {
                let key = fomelo2templateHash[detail[0].toLocaleLowerCase()];
                if(key === "augment-slot-types") {
                    let val = detailsObj[key] ? detailsObj[key] : "";
                    detailsObj[key] = val + detail[0].replace(/[^\d]+(\d+)[^\d]+/, "$1") + ",";
                } else if(key === "skill-modifier-type") {
                  let trimmedVal = detail[1].trim();
                  let val = trimmedVal.slice(trimmedVal.lastIndexOf(" "));
                  detailsObj["skill-modifier-type"] = trimmedVal.slice(0, trimmedVal.lastIndexOf(" "));
                  detailsObj["skill-modifier-amount"] = val.replaceAll("+", "");
                } else if(key === "bane-damage-amount") {
                  let trimmedVal = detail[1].trim();
                  let val = trimmedVal.slice(0, trimmedVal.indexOf(" "));
                  detailsObj["bane-damage-type"] = trimmedVal.slice(trimmedVal.indexOf(" "));
                  detailsObj["bane-damage-amount"] = val.replaceAll("+", "");
                } else if(key === "instrument-modifier-type") {
                  let trimmedVal = detail[1].trim();
                  let val = trimmedVal.slice(trimmedVal.lastIndexOf(" "));
                  detailsObj["instrument-modifier-type"] = trimmedVal.slice(0, trimmedVal.lastIndexOf(" "));
                  detailsObj["instrument-modifier-amount"] = val.replaceAll("+", "").replaceAll("(", "").replaceAll(")","");
                } else if (key === "focus-effect") {
                    // split on "Effect"
                    let splitDetail = detail[1].split("Effect");
                    if(splitDetail.length > 1) {
                        detailsObj["effect"] = detail[2].trim();
                    }
                    detailsObj["focus-effect"] = splitDetail[0].trim();
                } else {
                    detailsObj[key] = detail.slice(1).map(desc => desc.trim()).join(" ").replace("+","").replace("%","");
                }
            } else if(detail.length === 1) {
                detailsObj["misc"].push(detail[0])
            }
        });
  
        detailsObj["misc"].forEach((miscItem, index) => {
            if(index === 0) {
                detailsObj["item-flag"] = miscItem.replaceAll(" [", ",").replaceAll("]", "").replaceAll('[','').trim();
                return;
            }
  
            if(miscItem.search("Recommended") >= 0) {
                detailsObj["recommended-level"] = miscItem.replace(/[^\d]+(\d+)/, "$1");
                return;
            }
  
            if(miscItem.search("Required") >= 0) {
                detailsObj["required-level"] = miscItem.replace(/[^\d]+(\d+)/, "$1");
                return;
            }
        });
        if(typeof detailsObj["slot"] !== "undefined") {
            detailsObj["slot"] = detailsObj["slot"].replaceAll(" ", ",").replaceAll("Legs", "Leg").replaceAll("Shoulder", "Shoulders");
        }

        if(typeof detailsObj["class"] !== 'undefined' ) {

          detailsObj["class"] = detailsObj["class"].replaceAll(" ", ",");
        }
        if(typeof detailsObj["race"] !== 'undefined' ) {
          detailsObj["race"] = detailsObj["race"].replaceAll(" ", ",");
        }

        delete detailsObj['misc'];
  
        results.push({
            "item-name": details[0].textContent.replaceAll("\n","").replaceAll("`","'"),
            icon: icon,
            ...detailsObj
        });
        //augs will be at details index 2+, so you can loop on those too  
    });
  
    return results;
  }
  
  
  
  function generateTemplatesFor(arr) {
    let itemTemplates = {};
    let startOfTemplate = "{{Item\n";
    let endOfTemplate = "}}"
    arr.forEach(item => {
  
        let thisTemplate = startOfTemplate;
        Object.keys(item).sort().forEach(key => {
            thisTemplate += `|${key}=${item[key].trim()}\n`;
        });
        thisTemplate += endOfTemplate;
        itemTemplates[item["item-name"]] = thisTemplate;
    })
  
    console.log(itemTemplates);
    return itemTemplates;
  }
  
  
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
  
    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(itemName) {
    let text = templates[itemName];
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log("Async: Copying to clipboard was successful!");
    }, function(err) {
      console.error("Async: Could not copy text: ", err);
    });
  }
  
  window._fomelo2wiki.copyTextToClipboard = copyTextToClipboard;
  let result = itemToReadable();
  let templates = generateTemplatesFor(result);
  
  document.querySelectorAll(".general_info a").forEach(element => {
    element.addEventListener("click", () => {
      let itemName = element.getAttribute("href").split("/").slice(-1)[0].replaceAll("_", " ");
      copyTextToClipboard(itemName);
    })
  });
}

console.log("fomelo2wiki loaded");
_fomelo2wiki();
