/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var g_bFirstMenu = true;
  
function initialize ()
{
    var vShowVerantwoording = '';
    
    if (getOsVersion () >= 7)
        document.getElementById ('wrapper').style.top = '20px';
    vShowVerantwoording = readSetting ('verantwoording');
    if (   !vShowVerantwoording
        ||  vShowVerantwoording == '')
        fade ('verantwoording', true);
    else
        document.getElementById ('noShowAgain').checked = true;
    document.getElementById ('dimerValue').value = '';
//    document.getElementById ('dimerValue').focus();
}

function checkYears ()
{
    var vItems = document.getElementsByName ('item');
    var nItems = 0;
    var vHTML;
    
    for (var i=0; i < vItems.length; i++)
    {
    	if (vItems[i].checked)
    	    nItems += 1;
    }
    vHTML = 'Continue with ' + nItems + ' Years item';
    if (   nItems == 0
        || nItems > 1)
        vHTML += 's';
    var vButton = document.getElementById ('ddimer');
    if (vButton)
        vButton.innerHTML = vHTML;
    vItems = document.getElementsByName ('dresult');
    for (var i=0; i < vItems.length; i++)
    	vItems[i].checked = false;
}

function getNrItems()
{
    var vItems = document.getElementsByName ('item');
    var nItems = 0;
    
    for (var i=0; i < vItems.length; i++)
    {
    	if (vItems[i].checked)
    	    nItems += 1;
    }
    return nItems;
}

function enableShow ()
{

    if (document.getElementById ('high').checked)
        document.getElementById ('show').style.display = 'block';
    else if (document.getElementById ('low').checked)
        document.getElementById ('show').style.display = 'block';
    else
        document.getElementById ('show').style.display = 'none';
}

function showResult ()
{
    var vResult = document.getElementById ('result');
    var vHTML = '<br /><p>';
    var nItems;
    var bHigh = false;
    
    nItems = getNrItems ();
    if (nItems == 0)
        vHTML += 'No';
    else
        vHTML += nItems;
    vHTML += ' Years item';
    if (nItems != 1)
        vHTML += 's';
    if (nItems > 0)
        vHTML += ':';
    vHTML += '</p>';
    if (nItems > 0)
        vHTML += '<ul>';
    if (document.getElementById ('signs').checked)
    	vHTML += '<li>Clinical signs of Deep Venous Trombosis</li>';
    if (document.getElementById ('hemo').checked)
    	vHTML += '<li>Hemoptysis</li>';
    if (document.getElementById ('alternative').checked)
    	vHTML += '<li>Alternative diagnosis less likely than PE</li>';
    if (nItems > 0)
        vHTML += '</ul>';

    vHTML += '<p>';
    var vDimer = document.getElementById ('dimerValue');
    if (vDimer.value == '')
    {
    	alert ('You must enter the HS D-dimer blood value before continuing');
        document.getElementById ('dimerValue').focus();
    	return ;
    }
    var nDimer = parseInt (vDimer.value);
    if (nDimer >= 1000)
        bHigh = true;
    else if (   nDimer >= 500
             && nItems > 0)
        bHigh = true;
    if (bHigh)
    {
    	if (nItems == 0)
    	    vHTML += 'HS D-dimer &gt;= 1000ng/ml (';
    	else
    	    vHTML += 'HS D-dimer &gt;= 500ng/ml (';
    	vHTML += nDimer;
        vHTML += ')</p><p style="color:#f10202;">CTPA indicated</p>';
    }
    else
    {
    	if (nItems == 0)
    	    vHTML += 'HS D-dimer &lt; 1000ng/ml (';
    	else
    	    vHTML += 'HS D-dimer &lt; 500ng/ml (';
    	vHTML += nDimer;
        vHTML += ')</p><p style="color:#1ef102;">CTPA not indicated, Pulmonary Embolism excluded</p>';
    }
    vResult.innerHTML = vHTML;
    fade ('result', true);
}

function onClickAccepteer ()
{
    fade ('opening', false);
//    document.getElementById ('dimerValue').focus();
}

//---------------------------------------------------------------------------
// fade een div in of uit. de transition property moet wel gezet zijn, anders
// gaat het niet gelijdelijk, maar "klaBAM"
//
function fade (szObject, bFadeIn)
{
    var vDiv = document.getElementById (szObject);	// Dit object dus
    if (!vDiv)
        return ;									// niet gevonden? Dan kunnen we niks
        
    if (bFadeIn)
    {
        vDiv.style.opacity = '1';					// we faden door de transparency op 0 of 1 te zetten
        vDiv.style.transform = 'scale(1)';			// en te schalen
        vDiv.style.webkitTransform = 'scale(1)';	// voor alle browsers
        vDiv.style.mozTransform = 'scale(1)';		// :)
    }
    else
    {
        vDiv.style.opacity = '0';
        vDiv.style.transform = 'scale(0)';
        vDiv.style.webkitTransform = 'scale(0)';
        vDiv.style.mozTransform = 'scale(0)';
    }
}

function redo()
{
    var vItems = document.getElementsByName ('item');
    
    for (var i=0; i < vItems.length; i++)
    	vItems[i].checked = false;
    vItems = document.getElementsByName ('dresult');
    for (var i=0; i < vItems.length; i++)
    	vItems[i].checked = false;
    document.getElementById ('ddimer').innerHTML = 'Continue with 0 Years items';
    fade ('result', false);
    document.getElementById ('dimerValue').value = '';
    document.getElementById ('dimerValue').focus();
}

//-----------------------------------------------------------------------------------
// Welke versie iOS hebben we?
//
function getOsVersion()
{
    var agent = window.navigator.userAgent,
    start = agent.indexOf( 'OS ' );
    var r = 0;
    
    if ( /iphone|ipod|ipad|iPhone|iPod|iPad/.test( agent ) && start > -1 )
        r = window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
        
    return r;
}

//------------------------------------------------------------------------------
// ontrol het menu
//
function showMenu (vShow)
{
    
    if (vShow == 0)
    {
    	if (g_bFirstMenu)
    	{
    	    g_bFirstMenu = false;
    	    fade ('menuBox', false);
    	}
    }
    else
    {
    	var vMenu = document.getElementById ('menuBox');
    	menuBox.style.right  = '10px';
    	menuBox.style.top    = '55px';
    	menuBox.style.bottom = '';
    	menuBox.style.left   = '';
    	setTimeout(function () {g_bFirstMenu = true;}, 300);
    	fade ('menuBox', true);
    }
}

//-----------------------------------------------------------------------------------
// Sla een setting parameter op in de permanente storage
//
function saveSetting (szKey, szValue)
{
    if(typeof(Storage) !== "undefined")
    {
        localStorage.setItem (szKey, szValue);
    }
    else
        alert ('Sorry! No Web Storage support..');
}

//-----------------------------------------------------------------------------------
// Haal een setting parameter op uit de permanente storage
//
function readSetting (szKey)
{
    var szResult = '';
    
    if(typeof(Storage) !== "undefined")
    {
        szResult = localStorage.getItem(szKey);
    }
        
    return szResult;
}

function onClickVerant ()
{
    var vNoShow = '';
    if (document.getElementById ('noShowAgain').checked)
        vNoShow = 'NOSHOW';
    saveSetting ('verantwoording', vNoShow);
    
    fade ('verantwoording', false);
//    document.getElementById ('dimerValue').focus();
}

function showVerantwoording ()
{
    fade ('verantwoording', true);
}
