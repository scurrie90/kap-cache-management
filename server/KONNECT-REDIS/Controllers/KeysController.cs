﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KONNECT_REDIS.Models;
using KONNECT_REDIS.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KONNECT_REDIS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KeysController : ControllerBase
    {
        private IKeysService _keysService;

        public KeysController(IKeysService keysService)
        {
            _keysService = keysService;
        }

        /// <summary>
        /// Retrieve list of all keys in db
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(ICollection<Key>))]
        public IActionResult GetAllKeys()
        {
            try
            {
                var res = _keysService.GetAllKeys();

                if (res == null)
                {
                    return NotFound();
                }

                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }     
        }

        /// <summary>
        /// Retrieves a list of keys according to a pattern 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("[controller]/Query")]
        [ProducesResponseType(200, Type = typeof(ICollection<Key>))]
        public IActionResult GetKeyByQuery()
        {
            try
            {
                var res = _keysService.GetKeyByQuery();

                if (res == null)
                {
                    return NotFound();
                }

                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
